'use strict';

module.exports = function(task) {
    if (!task) {
        console.log('Please input a task to receive help info for.\n'.red);

        return false;
    }

    var help = require('./help.json'),
        delimiter = ' - ';

    for (var i = 0; i < help.length; i++) {
        var t = help[i][task];

        if (t) {
            console.log('\nHelp entry for ' + task.bold);
            console.log('\n    Description' + delimiter + t.description);

            if (t.arguments) {
                var args = t.arguments;

                console.log('\n    Arguments' + delimiter + '\n');

                for (var key in args) {
                    if (args.hasOwnProperty(key)) {
                        console.log('\t' + key + delimiter + args[key]);
                    }
                }
            }

            if (t.examples) {
                if (t.examples.length > 0) {
                    var title = '\n    Example';

                    if (t.examples.length === 1) {
                        console.log(title + delimiter + t.examples[0]);
                    } else {
                        title = title + 's';

                        console.log(title + delimiter + '\n');

                        for (var k = 0; k < t.examples.length; k++) {
                            console.log('\t' + t.examples[k]);
                        }
                    }
                }
            }

            return true;
        }
    }

    console.log(('A help entry does not exist for grunt task "' + task.bold + '". This is likely because the task does not exist or a help entry has not yet been created.\n').red);

    return false;
};