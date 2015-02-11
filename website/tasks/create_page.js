'use strict';

module.exports = function(title, done) {
    var fs = require('fs');

    fs.readFile('public/views/template.html', function(err, template) {
        if (err) {
            console.log(err.toString().red + '\n');
            return done(false);
        }

        template = template.toString().replace('template', title);

        fs.writeFile('public/views/' + title + '.html', template, function(err) {
            if (err) {
                console.log(err.toString().red + '\n');
                return done(false);
            }

            console.log('\nHTML file written successfully.');
            return done(true);
        });
    });
};