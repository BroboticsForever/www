'use strict';

var env = process.env.NODE_ENV || 'development',
    gruntArgs,
    nodeArgs;

if (env === 'development') {
    gruntArgs = [];
    nodeArgs = ['--debug'];
} else if (env === 'production' || env === 'test') {
    gruntArgs = ['--multi-process'];
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
                    args: gruntArgs,
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

    grunt.registerTask('default', 'Alias for \'jshint\' and \'nodemon\' tasks.' , ['jshint', 'nodemon']);

    grunt.registerTask('available_tasks', 'List all available grunt tasks', function(sorted) {
        require('./tasks/available_tasks')(grunt, sorted);
    });

    grunt.registerTask('create_help', 'Creates a help entry for the specified grunt task.', function (task) {
        var done = this.async();
        require('./tasks/create_help')(grunt, task, done);
    });
};