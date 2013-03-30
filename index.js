var srunner  = require('srunner')
  , path     = require('path')
  , optimist = require('optimist')
  , runner   = srunner.init({ dir: path.join(__dirname, './scripts') })
  , argv     = optimist
       .usage('Git cherry pick multiple commits.\nUsage: $0')
       .alias('o', 'origin')
       .describe('o', 'Origin branch (defaults to the current branch)')
       .alias('d', 'dest')
       .describe('d', 'Destination branch')
       .alias('p', 'pattern')
       .describe('p', 'Pattern to match when searching for commits')
       .alias('t', 'test')
       .describe('t', 'Test run just to see the selected commits')
       .boolean('t')
       .demand('d')
       .demand('p')
       .argv;

runner
   .saveCurrentBranch()
   .switchBranch({ branch: argv.origin })
   .findCommits({ pattern: argv.pattern })
   .printCommits()

if (!argv.test) {
    runner
       .switchBranch({ branch: argv.dest })
       .applyCommits()
}

runner.restoreCurrentBranch()
runner.run();
