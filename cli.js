#!/usr/bin/env node

const program = require('commander');
const fs = require('fs-extra');
const parse = require('parse-git-numstat');
const multimatch = require('multimatch');

const { table } = require('table');
const { createObjectCsvStringifier } = require('csv-writer');

const normalizeRenames = require('./lib/normalize-renames');
const markDeleted = require('./lib/mark-deleted');
const buildBusfactors = require('./lib/build-busfactors');

program.option('-g, --gitlog <gitlog>', 'path to git log with numstat', 'gitlog.txt');
program.option('-t, --threshold <threshold>', 'report busfactor below this threshold', 3);
program.option('-e, --exclude <glob>', 'glob pattern to exclude files', repeatable, []);
program.option('-i, --include <glob>', 'glob pattern to include files', repeatable, []);
program.option('-r, --report <table/csv>', 'report bus factors in csv or console table format', 'table');

program.parse(process.argv);

async function parseGitlog(args) {
  if (!(await fs.exists(args.gitlog))) {
    console.error(`Could not open gitlog file ${args.gitlog}`);
    process.exit(1);
  }

  const gitlogRaw = await fs.readFile(args.gitlog, { encoding: 'utf-8' });
  return parse(gitlogRaw);
}

async function buildReport(args) {
  const gitlog = await parseGitlog(args);

  const commits = markDeleted(normalizeRenames(gitlog.filter(commit => !commit.merge)));

  const matchPattern = buildMatchPattern(args.include, args.exclude);

  const busfactors = buildBusfactors(commits)
    .filter(file => file.busfactor < args.threshold)
    .filter(file => multimatch([file.filepath], matchPattern).length == 1);

  if (busfactors.length == 0) {
    console.log(`No files with bus factor less than threshold ${args.threshold} found`);
    return;
  }

  if (args.report == 'csv') {
    const records = busfactors.map(file => ({
      filepath: file.filepath,
      authors: file.authors,
      busfactor: file.busfactor,
    }));

    const writer = createObjectCsvStringifier({
      header: [{ id: 'filepath', title: 'Filepath' }, { id: 'authors', title: 'Authors' }, { id: 'busfactor', title: 'Bus Factor' }],
    });
    console.log(writer.stringifyRecords(records));
  } else {
    const tableData = busfactors.map(file => [file.filepath, file.authors, file.busfactor]);
    const config = {
      columns: {
        0: {
          width: 60,
        },
        1: {
          width: 20,
        },
        2: {
          width: 2,
        },
      },
    };

    const busfactorTable = table(tableData, config);
    console.log(busfactorTable);

    console.log(`Found ${tableData.length} files with a bus factor of ${args.threshold - 1} or below`);
  }
}

function buildMatchPattern(includes, excludes) {
  return [].concat(includes.length > 0 ? includes : '**/*.*', excludes.map(e => `!${e}`));
}

function repeatable(value, previous) {
  return [...previous, value];
}

buildReport(program);
