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

    var jf = require('jsonfile'),
        args = getArgumentNames(task);

    if (_task.info.indexOf('Alias') === -1 && _task.meta.info.indexOf('Npm') === -1 && !(args.length === 1 && args[0] === '')) {
        var prompt = require('prompt');

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

        console.log('Creating help entry for task "' + task + '"...\n');

        prompt.get(args, function(err, answers) {
            if (err) {
                console.log(err.toString().red + '\n');
                return done(false);
            }

            help.push(createJSON(task, createJSON('description', _task.info)));

            answers = JSON.stringify(answers).replace(/\\" -> /g, '');
            help[help.length - 1][task].arguments = JSON.parse(answers);

            prompt.message = 'Input number of examples';

            prompt.get(' -> ', function (err, answer) {
                if (err) {
                    console.log(err.toString().red + '\n');
                    return done(false);
                }

                var numExamples = answer[' -> '],
                    examples = [];

                console.log();

                for (var k = 0; k < numExamples; k++) {
                    examples.push(' #' + (k+1) + ' -> ');
                }

                prompt.message = 'Input example';

                prompt.get(examples, function(err, exampleAnswers) {
                    if (err) {
                        console.log(err.toString().red + '\n');
                        return done(false);
                    }

                    examples = [];
                    var l = 1;

                    for (var example in exampleAnswers) {
                        if (exampleAnswers.hasOwnProperty(example)) {
                            examples.push(exampleAnswers[' #' + l + ' -> ']);
                            l++;
                        }
                    }

                    help[help.length - 1][task].examples = examples;

                    jf.writeFile('./tasks/help.json', help, function (error) {
                        if (error) {
                            console.log(('\nThere was an error writing to the help.json file:\n\n\t' + error).red);
                            return done(false);
                        } else {
                            console.log('\nEntry written to help.json successfully.');
                            return done(true);
                        }
                    });
                });
            });
        });
    } else {
        console.log('Task is an alias or an NPM task, or the task does not take any arguments.\nCreating help entry with description and example...\n');

        var entry = JSON.parse('{"' + task + '": ' + '{"description": "' + _task.info + '", "examples": []}}');

        entry[task].examples = ['"grunt ' + task + '"'];

        help.push(entry);

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