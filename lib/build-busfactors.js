module.exports = function(commits) {
  const files = {};

  for (const commit of commits) {
    for (const stat of commit.stat) {
      files[stat.filepath] = files[stat.filepath] || {};
      files[stat.filepath][commit.author.email] = (files[stat.filepath][commit.author.email] || 0) + 1;

      if (stat.isDeleted) {
        delete files[stat.filepath];
      }
    }
  }

  const busfactors = Object.keys(files)
    .map(filepath => ({
      filepath,
      busfactor: Object.keys(files[filepath]).length,
      authors: Object.keys(files[filepath]),
      commits: countCommits(files[filepath]),
    }))
    .filter(file => file.commits > 1);

  busfactors.sort(sortByBusfactorDescending);

  return busfactors;
};

function countCommits(fileAuthors) {
  return Object.keys(fileAuthors).reduce((aggregate, author) => aggregate + fileAuthors[author], 0);
}

function sortByBusfactorDescending(left, right) {
  return right.busfactor - left.busfactor;
}
