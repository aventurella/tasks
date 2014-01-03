define(function(require, exports, module) {

var marionette = require('marionette');
var backbone = require('backbone');
var template = require('hbs!app/organization/templates/dashboard-user-task-cell');

var DashboardUserTaskCell = marionette.ItemView.extend({
    template: template,
    tagName: 'li',
    className: 'task',

    initialize: function(options){

    }
});

exports.DashboardUserTaskCell = DashboardUserTaskCell;

});
