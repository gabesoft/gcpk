var git = require('../lib/git');

module.exports = (state, options, cb) {
    var branch  = options.branch
      , pattern = new RegExp(options.pattern);

    if (!branch) { 
        return cb(new Error('No branch specified'));
    }

    git.log({ branch : branch }, function (err, list) {
        if (err) { return cb(err); }

        var commits = list.filter(function (commit) {
                return pattern.test(commit.comment);
            });

        cb(null, commits);
    }
};

