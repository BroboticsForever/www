'use strict';

function createJSON(key, value) {
    return JSON.parse('{'+ JSON.stringify(key) + ':' + JSON.stringify(value) + '}');
}

function getArgumentNames(task){
    var reg = /\(([\s\S]*?)\)/,
        args = reg.exec(require('./' + task));

    return args[1].split(', ');
}

module.exports = function(grunt, task, done) {
    var tasks = grunt.task._tasks,
        _task = tasks[task];

    if (!_task) {
        console.log(('No grunt task found with the name "' + task + '".\n').red);
        return done(false);
    }

    var help = require('./help.json');

    for (var i = 0; i < help.length; i++) {
        if (help[i][task]) {
            console.log(('Help entry already exists for this task.\n').red);
            return done(false);
        }
    }


    var jf = require('jsonfile');

    if (_task.info.indexOf('Alias') === -1 && _task.meta.info.indexOf('Npm') === -1) {
        var prompt = require('prompt'),
            args = getArgumentNames(task);

        if (args[0] === 'grunt'){
            args = args.splice(1, args.length);
        }

        if (args[args.length-1] === 'done') {
            args = args.splice(0, args.length-1);
        }

        for (var j = 0; j < args.length; j++) {
            args[j] = args[j] + '" -> ';
        }

        prompt.message = 'Input description for argument "';
        prompt.delimiter = '';
        prompt.colors = false;

        prompt.start();

        prompt.get(args, function(err, answers) {
            if (!err) {
                console.log('\nCreating help entry for task "' + task + '"...\n');

                help.push(createJSON(task, createJSON('description', _task.info)));
                answers = JSON.stringify(answers).replace(/\\" -> /g, '');
                help[help.length-1][task].arguments = JSON.parse(answers);

                jf.writeFile('./tasks/help.json', help, function(error) {
                    if (error) {
                        console.log(('There was an error writing to the help.json file:\n\n\t' + error).red);
                        return done(false);
                    } else {
                        console.log('Entry written to help.json successfully.');
                        return done(true);
                    }
                });
            }
        });
    } else {
        console.log('Task is an alias or an NPM task, creating help entry with description only...\n');

        help.push(createJSON(task, createJSON('description', _task.info)));

        jf.writeFile('./tasks/help.json', help, function(error) {
            if (error) {
                console.log(('There was an error writing to the help.json file:\n\n\t' + error).red);
                return done(false);
            } else {
                console.log('Entry written to help.json successfully.');
                return done(true);
            }
        });
    }
};