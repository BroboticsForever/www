'use strict';

module.exports = function(title, done) {
    if (!title) {
        console.log('\nPlease provide a title for the html file.\n'.red);
        return done(false);
    }

    var fs = require('fs');

    fs.readFile('public/views/template.html', function(err, template) {
        if (err) {
            console.log(err.toString().red + '\n');
            return done(false);
        }

        template = template.toString().replace('template', title);

        var changeCase = require('change-case'),
            snakeTitle = changeCase.snakeCase(title);

        fs.writeFile('public/views/' + snakeTitle + '.html', template, function(err) {
            if (err) {
                console.log(err.toString().red + '\n');
                return done(false);
            }

            console.log('\npublic/views/' + snakeTitle + '.html was written successfully.\n');

            fs.readFile('public/js/app.js', function(err, app) {
                if (err) {
                    console.log(err.toString().red + '\n');
                    return done(false);
                }

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
            });
        });
    });
};