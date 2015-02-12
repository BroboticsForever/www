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

        console.log('public/views/' + snakeTitle + '.html was written successfully.');

        callback(title, done, writeAppFile);
    });
}

function readAppFile(title, done, callback) {
    fs.readFile('public/js/app.js', function(err, app) {
        if (err) {
            console.log(err.toString().red + '\n');
            return done(false);
        }

        callback(title, app, done, readAppRoutesFile);
    });
}

function writeAppFile(title, app, done, callback) {
    var pascalTitle = changeCase.pascalCase(title);

    app = app.toString().replace(']);', ', \'' + pascalTitle + 'Ctrl\', \'' + pascalTitle + 'Service\']);');

    fs.writeFile('public/js/app.js', app, function(err) {
        if (err) {
            console.log(err.toString().red + '\n');
            return done(false);
        }

        console.log('public/js/app.js was written successfully.');

        callback(title, done, writeAppRoutesFile);
    });
}

function readAppRoutesFile(title, done, callback) {
    fs.readFile('public/js/appRoutes.js', function(err, routes) {
        if (err) {
            console.log(err.toString().red + '\n');
            return done(false);
        }

        callback(title, routes, done, readTemplateServiceFile);
    });
}

function writeAppRoutesFile(title, routes, done, callback) {

    routes = routes.toString().replace('.otherwise', '.when(\'/' + changeCase.paramCase(title) + '\', {\n\t\t\ttemplateURL: \'views/' + changeCase.snakeCase(title) + '.html\',\n\t\t\tcontroller: \'' + changeCase.pascalCase(title) + 'Controller\'\n\t\t})\n\n\t\t.otherwise');

    fs.writeFile('public/js/appRoutes.js', routes, function(err) {
        if (err) {
            console.log(err.toString().red + '\n');
            return done(false);
        }

        console.log('public/js/appRoutes.js was written successfully.');

        callback(title, done, writeServiceFile);
    });
}

function readTemplateServiceFile(title, done, callback) {
    fs.readFile('public/js/services/template.js', function(err, template) {
        if (err) {
            console.log(err.toString().red + '\n');
            return done(false);
        }

        callback(title, template, done, readTemplateCtrlFile);
    });
}

function writeServiceFile(title, service, done, callback) {
    var pascalTitle = changeCase.pascalCase(title),
        serviceFile = 'public/js/services/' + pascalTitle + 'Service.js';

    service = service.toString().replace(/template/g, pascalTitle);

    fs.writeFile(serviceFile, service, function(err) {
        if (err) {
            console.log(err.toString().red + '\n');
            return done(false);
        }

        console.log(serviceFile + ' was written successfully.');

        callback(title, done, writeCtrlFile);
    });
}

function readTemplateCtrlFile(title, done, callback) {
    fs.readFile('public/js/controllers/template.js', function(err, template) {
        if (err) {
            console.log(err.toString().red + '\n');
            return done(false);
        }

        callback(title, template, done);
    });
}

function writeCtrlFile(title, controller, done) {
    var pascalTitle = changeCase.pascalCase(title),
        controllerFile = 'public/js/controllers/' + pascalTitle + 'Ctrl.js';

    controller = controller.toString().replace(/template/g, pascalTitle);

    fs.writeFile(controllerFile, controller, function(err) {
        if (err) {
            console.log(err.toString().red + '\n');
            return done(false);
        }

        console.log(controllerFile + ' was written successfully.');

        return done(true);
    });
}

module.exports = function(title, done) {
    if (!title) {
        console.log('\nPlease provide a title for the html file.\n'.red);
        return done(false);
    }

    console.log('\nAttempting to create a new page...\n');

    return createNewPage(title, done);
};