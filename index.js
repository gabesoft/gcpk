var Runner   = require('srunner').Runner
  , runner   = new Runner()
  , path     = require('path')
  , optimist = require('optimist')
  , argv     = optimist
       .usage('Git cherry pick multiple commits.\nUsage: $0')
       .alias('o', 'origin').describe('o', 'Origin branch (defaults to the current branch)')
       .alias('d', 'dest').describe('d', 'Destination branch').demand('d')
       .alias('p', 'pattern').describe('p', 'Pattern to match when searching for commits').demand('p')
       .alias('t', 'test').describe('t', 'Test run just to see the selected commits').boolean('t')
       .argv;

runner
   .init({ dir: path.join(__dirname, './scripts') })
   .saveCurrentBranch()
   .switchBranch({ branch: argv.origin })
   .findCommits({ pattern: argv.pattern })
   .printCommits();

if (!argv.test) {
    runner
       .switchBranch({ branch: argv.dest })
       .applyCommits();
}

runner
   .restoreCurrentBranch()
   .run();
