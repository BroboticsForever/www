'use strict';

var fs = require('fs'),
    changeCase = require('change-case');

function checkErr(err) {
    if (err) {
        console.log(err.toString().red + '\n');
        return true;
    }
    return false;
}

function createNewPage(title, done) {
    readTemplateHTMLFile(title, done, writeHTMLFile);
}

function readTemplateHTMLFile(title, done) {
    fs.readFile('public/views/template.html', function(err, template) {
        if (checkErr(err)) {
            return done(false);
        }

        writeHTMLFile(title, template, done);
    });
}

function writeHTMLFile(title, template, done) {
    template = template.toString().replace('template', title);

    var snakeTitle = changeCase.snakeCase(title);

    fs.writeFile('public/views/' + snakeTitle + '.html', template, function(err) {
        if (checkErr(err)) {
            return done(false);
        }

        console.log('public/views/' + snakeTitle + '.html was written successfully.');

        readAppFile(title, done);
    });
}

function readAppFile(title, done) {
    fs.readFile('public/js/app.js', function(err, app) {
        if (checkErr(err)) {
            return done(false);
        }

        writeAppFile(title, app, done);
    });
}

function writeAppFile(title, app, done) {
    var pascalTitle = changeCase.pascalCase(title);

    app = app.toString().replace(']);', ', \'' + pascalTitle + 'Ctrl\', \'' + pascalTitle + 'Service\']);');

    fs.writeFile('public/js/app.js', app, function(err) {
        if (checkErr(err)) {
            return done(false);
        }

        console.log('public/js/app.js was written successfully.');

        readAppRoutesFile(title, done);
    });
}

function readAppRoutesFile(title, done) {
    fs.readFile('public/js/appRoutes.js', function(err, routes) {
        if (checkErr(err)) {
            return done(false);
        }

        writeAppRoutesFile(title, routes, done);
    });
}

function writeAppRoutesFile(title, routes, done) {

    routes = routes.toString().replace('.otherwise', '.when(\'/' + changeCase.paramCase(title) + '\', {\n\t\t\ttemplateUrl: \'views/' + changeCase.snakeCase(title) + '.html\',\n\t\t\tcontroller: \'' + changeCase.pascalCase(title) + 'Controller\'\n\t\t})\n\n\t\t.otherwise');

    fs.writeFile('public/js/appRoutes.js', routes, function(err) {
        if (checkErr(err)) {
            return done(false);
        }

        console.log('public/js/appRoutes.js was written successfully.');

        readTemplateServiceFile(title, done);
    });
}

function readTemplateServiceFile(title, done) {
    fs.readFile('public/js/services/template.js', function(err, template) {
        if (checkErr(err)) {
            return done(false);
        }

        writeServiceFile(title, template, done);
    });
}

function writeServiceFile(title, service, done) {
    var pascalTitle = changeCase.pascalCase(title),
        serviceFile = 'public/js/services/' + pascalTitle + 'Service.js';

    service = service.toString().replace(/template/g, pascalTitle);

    fs.writeFile(serviceFile, service, function(err) {
        if (checkErr(err)) {
            return done(false);
        }

        console.log(serviceFile + ' was written successfully.');

        readTemplateCtrlFile(title, done);
    });
}

function readTemplateCtrlFile(title, done) {
    fs.readFile('public/js/controllers/template.js', function(err, template) {
        if (checkErr(err)) {
            return done(false);
        }

        writeCtrlFile(title, template, done);
    });
}

function writeCtrlFile(title, controller, done) {
    var pascalTitle = changeCase.pascalCase(title),
        controllerFile = 'public/js/controllers/' + pascalTitle + 'Ctrl.js';

    controller = controller.toString().replace(/template/g, pascalTitle);

    fs.writeFile(controllerFile, controller, function(err) {
        if (checkErr(err)) {
            return done(false);
        }

        console.log(controllerFile + ' was written successfully.');

        readIndexHTMLFile(title, done);
    });
}

function readIndexHTMLFile(title, done) {
    fs.readFile('public/index.html', function(err, indexHTML) {
        if (checkErr(err)) {
            return done(false);
        }

        writeIndexHTMLFile(title, indexHTML, done);
    });
}

function writeIndexHTMLFile(title, indexHTML, done) {
    var pascalTitle = changeCase.pascalCase(title),
        paramTitle = changeCase.paramCase(title);

    indexHTML = indexHTML.toString().replace('<script src="js/appRoutes.js"></script>', '<script src="js/controllers/' + pascalTitle + 'Ctrl.js"></script>\n\t<script src="js/services/' + pascalTitle + 'Service.js"></script>\n\t<script src="js/appRoutes.js"></script>');
    indexHTML = indexHTML.replace('<!-- link marker -->', '<li><a href="/' + paramTitle + '">' + title + '</a></li>\n\t\t\t<!-- link marker -->');

    fs.writeFile('public/index.html', indexHTML, function(err) {
        if (checkErr(err)) {
            return done(false);
        }

        console.log('index.html was written successfully.');

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