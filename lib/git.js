var exec  = require('child_process').exec
  , async = require('async');

function isFunction(obj) {
    var getType = {};
    return obj && getType.toString.call(obj) === '[object Function]';
}

function parseBranches (stdout) {
    var patt = /\*/;

    return stdout
       .toString('utf8')
       .split('\n')
       .filter(Boolean)
       .map(function (line) {
            return {
                branch  : line.replace(patt, '').trim()
              , current : patt.test(line)
            };
        });
}

function listBranches (cb) {
    exec('git branch', function (err, stdout, stderr) {
        if (err) { return cb(err); }
        cb(null, parseBranches(stdout));
    });
}

function createBranch (branch, cb) {
    exec('git branch ' + branch, function (err, stdout, stderr) {
        cb(err);
    });
}

function switchBranch (branch, cb) {
    exec('git checkout ' + branch, function (err, stdout, stderr) {
        cb(err);
    });
}

function commitExists (commitHash, cb) {
    exec('git branch --contains ' + commitHash, function (err, stdout, stderr) {
        if (err) { return cb(err); }

        var branches = parseBranches(stdout)
          , exists   = branches.some(function (b) { return b.current; });

        cb(null, exists);
    });
}

function cherryPick (commitHash, cb) {
    commitExists(commitHash, function (err, exists) {
        if (err) { return cb(err); }

        if (exists) {
            console.log('Commit ' + commitHash + ' exists. Skipping ...');
            return cb();
        }

        exec('git cherry-pick ' + commitHash, function (err, stdout, stderr) {
            cb(err);
        });
    });
}

function log (cb) {
    var fields = {
            longHash  : '%H'
          , shortHash : '%h'
          , author    : '%an'
          , date      : '%cr'
          , body      : '%B'
        }
      , fieldSeparator  = '\x1f'
      , recordSeparator = '\x1e'
      , names           = Object.keys(fields)
      , values          = names.map(function (n) { return fields[n]; })
      , format          = values.join(fieldSeparator) + recordSeparator;

    exec('git log --pretty=format:\'' + format + '\'', function (err, stdout, stderr) {
        if (err) { return cb(err); }
        var commits  = stdout
               .toString('utf8')
               .split(recordSeparator)
               .filter(Boolean)
               .map(function(line) { return line.split(fieldSeparator); })
               .map(function(data) {
                    var commit = {};

                    names.forEach(function (name, i) {
                        commit[name] = data[i].trim();
                    });

                    return commit;
                });

        cb(null, commits);
    });
}

module.exports.log        = log;
module.exports.cherryPick = cherryPick;

module.exports.branch = function (options, cb) {
    if (isFunction(options)) {
        cb      = options;
        options = {};
    }

    options = options || {};

    if (!options.branch) { return listBranches(cb); }

    async.waterfall([
        listBranches
      , function (branches, next) {
            var existing = branches.filter(function (b) {
                    return b.branch === options.branch;
                });

            if (existing.length > 0 && existing[0].current) {
                return next();
            }

            if (existing.length === 0) {
                if (options.create) {
                    createBranch(options.branch, next);
                } else {
                    next(new Error('Branch ' + options.branch + ' does not exist.'));
                }
            } else {
                next();
            }
        }
      , function (next) {
            if (options.checkout) {
                switchBranch(options.branch, next);
            } else {
                next();
            }
        }
    ], cb);
}
