'use strict';

var fs = require('fs'),
    changeCase = require('change-case');

function createNewPage(title, done) {
    readTemplateHTMLFile(title, done, writeHTMLFile);
}

function readTemplateHTMLFile(title, done, callback) {
    fs.readFile('public/views/template.html', function(err, template) {
        if (err) {
            console.log(err.toString().red + '\n');
            return done(false);
        }

        callback(title, template, done, readAppFile);
    });
}

function writeHTMLFile(title, template, done, callback) {
    template = template.toString().replace('template', title);

    var snakeTitle = changeCase.snakeCase(title);

    fs.writeFile('public/views/' + snakeTitle + '.html', template, function(err) {
        if (err) {
            console.log(err.toString().red + '\n');
            return done(false);
        }

        console.log('\npublic/views/' + snakeTitle + '.html was written successfully.\n');

        callback(title, done, writeAppFile);
    });
}

function readAppFile(title, done, callback) {
    fs.readFile('public/js/app.js', function(err, app) {
        if (err) {
            console.log(err.toString().red + '\n');
            return done(false);
        }

        callback(title, app, done);
    });
}

function writeAppFile(title, app, done) {
    var pascalTitle = changeCase.pascalCase(title);

    app = app.toString().replace(']);', ', \'' + pascalTitle + 'Ctrl\', \'' + pascalTitle + 'Service\']);');

    fs.writeFile('public/js/app.js', app, function(err) {
        if (err) {
            console.log(err.toString().red + '\n');
            return done(false);
        }

        console.log('public/js/app.js was written successfully.');
        return done(true);
    });
}

module.exports = function(title, done) {
    if (!title) {
        console.log('\nPlease provide a title for the html file.\n'.red);
        return done(false);
    }

    createNewPage(title, done);
};