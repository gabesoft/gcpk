var srunner  = require('srunner')
  , path     = require('path')
  , optimist = require('optimist')
  , runner   = srunner.init({ dir: path.join(__dirname, './scripts') })
  , argv     = optimist
       .usage('Git cherry pick commits from one branch to another.\nUsage: gcp')
       .alias('o', 'origin')
       .describe('o', 'Origin branch (defaults to the current branch)')
       .alias('d', 'dest')
       .describe('d', 'Destination branch')
       .alias('p', 'pattern')
       .describe('p', 'Pattern to match when searching for commits')
       .alias('t', 'test')
       .describe('t', 'Test run just to see selected commits')
       .demand('d')
       .demand('p')
       .argv;

if (argv.test) {
    runner
       .switchBranch({ branch: argv.origin })
       .findCommits({ pattern: argv.pattern })
       .printCommits()
} else {
    runner
       .switchBranch(argv.origin)
       .findCommits(argv.pattern)
       .switchBranch(argv.dest)
       .applyCommits()
}

runner.run();
