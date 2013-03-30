var git = require('../lib/git');

module.exports = function (state, options, cb) {
    if (state.currentBranch) {
        git.branch({
            branch   : state.currentBranch
          , checkout : true
        }, cb);
    } else {
        cb();
    }
};

