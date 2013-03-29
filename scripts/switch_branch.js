var git = require('../lib/git');

module.exports = function (options, cb) {
    if (!options.branch) { return cb(); }

    git.branch({
        branch : branch
      , create : true
    }, cb);
};
