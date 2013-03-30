var git = require('../lib/git');

module.exports = function (options, cb) {
    if (!options.branch) { return cb(); }

    git.branch({
        branch   : options.branch
      , create   : true
      , checkout : true
    }, cb);
};
