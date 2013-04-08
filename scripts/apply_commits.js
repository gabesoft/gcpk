var async = require('async')
  , git   = require('../lib/git');

require('colors');

module.exports = function (state, options, cb) {
    if (!state.commits) { throw new Error('No commits specified'); }

    var commits = state.commits.splice(0);

    commits.reverse()

    async.forEachSeries(commits, function (commit, next) {
        console.log('Applying commit ' + commit.shortHash.red);
        git.cherryPick(commit.longHash, function (err) {
            if (err) {
                console.log('Apply failed'.red, err);
            }
            next();
        });
    }, cb);
};
