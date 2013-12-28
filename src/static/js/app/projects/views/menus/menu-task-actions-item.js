define(function(require, exports, module) {

var marionette = require('marionette');
var template = require('hbs!app/projects/templates/menu-task-actions-item');

var TaskActionsMenuItem = marionette.ItemView.extend({
    template: template,
    tagName: 'li'
});

exports.TaskActionsMenuItem = TaskActionsMenuItem;

});

