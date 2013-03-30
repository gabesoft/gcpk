require('colors');

module.exports = function (state, options, cb) {
    var total = 'Total  : ' + state.commits.length + ' commits';

    state.commits.forEach(function (commit) {
        var hash   = commit.shortHash.red
          , body   = commit.body.substring(0, 50)
          , author = commit.author.green;
        console.log(hash + ': ' + body + ' ' + author);
    });

    console.log(total.yellow);
    cb();
};
