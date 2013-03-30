var git = require('../lib/git');

module.exports = function (state, options, cb) {
    git.branch(function (err, branches) {
        if (err) { return cb(err); }

        var current = branches.filter(function (b) {
            return b.current;
        })[0];

        if (current) {
            state.currentBranch = current.branch;
        }

        cb();
    });
};
