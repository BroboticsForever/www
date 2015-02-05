'use strict';

var env = process.env.NODE_ENV || 'development',
    args,
    nodeArgs;

if (env === 'development') {
    args = [];
    nodeArgs = ['--debug'];
} else if (env === 'production' || env === 'test') {
    args = ['--multi-process'];
    nodeArgs = [];
} else {
    console.log('\nIncorrect value for environment variable NODE_ENV');
    console.log('Appropriate values are "development", "production", or "test".\n');
    process.exit(0);
}

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: {
                src: ['Gruntfile.js', 'server.js', 'app/**/*.js', 'config/*.js', 'public/js/**/*.js'],
                options: {
                    jshintrc: true
                }
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    args: args,
                    ignore: ['node_modules/**'],
                    ext: 'js,html',
                    nodeArgs: nodeArgs,
                    delayTime: 1,
                    cwd: __dirname
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-nodemon');

    grunt.registerTask('default', ['jshint', 'nodemon']);

    grunt.registerTask('available_tasks', 'List all available tasks', function(sorted) {
        sorted = (sorted !== 'false');

        for (var task in grunt.task._tasks) {
            availableTasks.push(task);
        }

        if (sorted) {
            availableTasks.sort(function (a, b) {
                var textA = a.toUpperCase(),
                    textB = b.toUpperCase();

                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
        }

        console.log('\nThe following ' + availableTasks.length + ' tasks are available for use:\n');

        availableTasks.forEach(function(task) {
            console.log(task);
        });
    });

    grunt.registerTask('create_help', 'Creates a help entry for the specified grunt task.', function (task) {
        for (var t in grunt.task._tasks) {
            if (t === task) {
                console.log('Creating help entry for task "' + task + '"...');

                var fs = require('fs');
                var help = JSON.parse(fs.readFileSync('help/tasks.json', 'utf8'));

                console.log(help);

                return true;
            }
        }

        console.log('\nNo grunt task found with the name "' + task + '". Please try again.\n');
        return false;
    });
};