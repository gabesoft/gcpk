var git = require('../lib/git');

function hasUpperCase (text) {
    var len = text.length
      , c   = null
      , i   = 0;

    for (i = 0; i < len; i++){
        c = text.charAt(i);
        if (c === c.toUpperCase()) {
            return true;
        }
    };

    return false;
}

module.exports = function (state, options, cb) {
    var regopts = hasUpperCase(options.pattern) ? '' : 'i'
      , pattern = new RegExp(options.pattern, regopts);

    git.log({}, function (err, list) {
        if (err) { return cb(err); }

        state.commits = list.filter(function (commit) {
            return pattern.test(commit.body);
        });

        cb(null);
    });
};

