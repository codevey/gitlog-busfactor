module.exports = function(commitsArr) {
  const commits = [...commitsArr];
  commits.sort(sortCommitsByDateAscending);

  const fileChanges = {};
  for (const commit of commits) {
    for (const stat of commit.stat.filter(s => !s.binary)) {
      if (!fileChanges[stat.filepath]) {
        fileChanges[stat.filepath] = stat.added - stat.deleted;
      } else {
        fileChanges[stat.filepath] += stat.added - stat.deleted;

        if (stat.deleted > 0 && stat.added == 0 && fileChanges[stat.filepath] <= 0) {
          stat.deleted = true;
        }
      }
    }
  }

  return commits;
};

// TODO: Duplicates function in normalize-renames.js
function sortCommitsByDateAscending(left, right) {
  return left.date - right.date;
}
