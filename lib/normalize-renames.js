module.exports = function normalizeRenames(commitsArr) {
  const commits = [...commitsArr];
  commits.sort(sortCommitsByDateAscending);

  for (let i = 0; i < commits.length; i++) {
    for (const stat of commits[i].stat) {
      if (stat.renames) {
        applyRename(commits, i, stat);
      }
    }
  }

  return commits;
};

function applyRename(commits, toIndex, stat) {
  for (let i = 0; i < toIndex; i++) {
    for (const commitStat of commits[i].stat) {
      if (commitStat.filepath == stat.renames) {
        commitStat.filepath = stat.filepath;
      }
    }
  }
}

function sortCommitsByDateAscending(left, right) {
  return left.date - right.date;
}
