'use strict';

module.exports = function(grunt, sorted) {
    var availableTasks = [];

    sorted = (sorted !== 'false' && sorted !== 'f');

    for (var task in grunt.task._tasks) {
        if (grunt.task._tasks.hasOwnProperty(task)) {
            availableTasks.push(task);
        }
    }

    if (sorted) {
        availableTasks.sort(function (a, b) {
            var textA = a.toUpperCase(),
                textB = b.toUpperCase();

            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
    }

    console.log('\nThe following ' + availableTasks.length + ' tasks are available for use:\n');

    availableTasks.forEach(function (task) {
        console.log(task);
    });
};