var git = require('../lib/git');

module.exports = (branch, cb) {
    if (!branch) { return cb(); }

    git.branch({
        branch : branch
      , create : true
    }, cb);
};
