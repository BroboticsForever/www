'use strict';

var env = process.env.NODE_ENV || 'development',
    args,
    nodeArgs;

if (env === 'development') {
    args = [];
    nodeArgs = ['--debug'];
} else {
    args = ['--multi-process'];
    nodeArgs = [];
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
        var done = this.async(), availableTasks = [];

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

        done();
    });

};