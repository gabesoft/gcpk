
module.exports = function (state, options, cb) {
    state.commits.forEach(function (commit) {
        console.log(commit);
    });
    cb();
};
