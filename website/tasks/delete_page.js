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

module.exports = function(title, done) {
    var pubRoot = 'public/',
        htmlFile = pubRoot + 'views/' + changeCase.snakeCase(title) + '.html',
        serviceFile = pubRoot + 'js/services/' + changeCase.pascalCase(title) + 'Service.js',
        ctrlFile = pubRoot + 'js/controllers/' + changeCase.pascalCase(title) + 'Ctrl.js',
        appFile = 'public/js/app.js',
        routesFile = 'public/js/appRoutes.js',
        indexFile = 'public/index.html';

    console.log('Attempting to delete page ' + title + '...\n');

    fs.unlink(htmlFile, function(err) {
        if (checkErr(err)) {
            return done(false);
        }

        console.log(htmlFile + ' was deleted successfully.');

        fs.unlink(serviceFile, function(err) {
            if (checkErr(err)) {
                return done(false);
            }

            console.log(serviceFile + ' was deleted successfully.');

            fs.unlink(ctrlFile, function(err) {
                if (checkErr(err)) {
                    return done(false);
                }

                console.log(ctrlFile + ' was deleted successfully.');

                fs.readFile(appFile, function(err, app) {
                    if (checkErr(err)) {
                        return done(false);
                    }

                    var reg = new RegExp(', \'' + changeCase.pascalCase(title) + 'Ctrl\', \'' + changeCase.pascalCase(title) + 'Service\'');

                    app = app.toString().replace(reg, '');

                    fs.writeFile(appFile, app, function(err) {
                        if (checkErr(err)) {
                            return done(false);
                        }

                        console.log(appFile + ' was updated successfully.');

                        fs.readFile(routesFile, function(err, routes) {
                            if (checkErr(err)) {
                                return done(false);
                            }

                            reg = new RegExp('.when[(]\'\/' + changeCase.paramCase(title) + '[^\)]*[^\.]*', 'g');

                            routes = routes.toString().replace(reg, '');

                            fs.writeFile(routesFile, routes, function(err) {
                                if (checkErr(err)) {
                                    return done(false);
                                }

                                console.log(routesFile + ' was updated successfully.');

                                fs.readFile(indexFile, function(err, index) {
                                    if (checkErr(err)) {
                                        return done(false);
                                    }

                                    index = index.toString().replace('<script src="js/controllers/' + changeCase.pascalCase(title) + 'Ctrl.js"></script>\n\t', '');
                                    index = index.replace('<script src="js/services/' + changeCase.pascalCase(title) + 'Service.js"></script>\n\t', '');
                                    index = index.replace('<li><a href="/' + changeCase.paramCase(title) + '">' + title + '</a></li>\n\t\t\t', '');

                                    fs.writeFile(indexFile, index, function(err) {
                                        if (checkErr(err)) {
                                            return done(false);
                                        }

                                        console.log(indexFile + ' was updated successfully.\n');

                                        console.log(title + ' page was successfully deleted!');

                                        return done(true);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};