var exec  = require('child_process').exec
  , async = require('async');

function listBranches (cb) {
    exec('git branch', function (err, stdout, stderr) {
        if (err) { return cb(err); }

        var patt = /\*/
          , list = stdout
               .toString('utf8')
               .split('\n')
               .filter(Boolean)
               .map(function (line) {
                    return {
                        branch: line.replace(patt, '').trim()
                      , curent: patt.test(line)
                    };
                });

        cb(null, list);
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

function log (options, cb) {
    var fields = [ '%H', '%an', '%B' ]
      , format = fields.join('\x1f') + '\x1e';

    exec('git log --pretty=format:\'' + format + '\'', function (err, stdout, stderr) {
        if (err) { return cb(err); }
        var commits  = stdout
               .toString('utf8')
               .split('\x1e')
               .filter(Boolean)
               .map(function(line) { return line.split('\x1f'); })
               .map(function(fields) { 
                    return {
                        hash: fields[0].trim()
                      , author: fields[1].trim()
                      , body: fields[2].trim()
                    };
                });

        cb(null, commits);
    });
}

module.exports.log = log;

module.exports.branch = function (options, cb) {
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
            switchBranch(options.branch, next);
        }
    ], cb);
}
