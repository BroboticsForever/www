'use strict';

var env = process.env.NODE_ENV || 'development',
    myArgs,
    nodeArgs;

if (env === 'development') {
    myArgs = [];
    nodeArgs = ['--debug'];
} else if (env === 'production' || env === 'test') {
    myArgs = ['--multi-process'];
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
                src: ['Gruntfile.js', 'server.js', 'app/**/*.js', 'config/*.js', 'public/js/**/*.js', 'tasks/*.js'],
                options: {
                    jshintrc: true
                }
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    args: myArgs,
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
        return require('./tasks/available_tasks')(grunt, sorted);
    });

    grunt.registerTask('create_help', 'Creates a help entry for the specified grunt task.', function (task) {
        var done = this.async();
        return require('./tasks/create_help')(grunt, task, done);
    });

    grunt.registerTask('help', 'View the help entry for the specified grunt task.', function(task) {
        return require('./tasks/help.js')(task);
    });

    grunt.registerTask('add_page', 'Add a page with the specified title to the website.', function(title) {
        var done = this.async();
        return require('./tasks/add_page')(title, done);
    });
};