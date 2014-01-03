define(function(require, exports, module) {

var marionette = require('marionette');
var backbone = require('backbone');
var DashboardUserTaskCell = require('./dashboard-user-task-cell').DashboardUserTaskCell;
var template = require('hbs!app/organization/templates/dashboard-user-cell');

var DashboardUserCell = marionette.CompositeView.extend({
    template: template,
    tagName: 'li',
    className: 'user',
    itemViewContainer: '.tasks',
    itemView: DashboardUserTaskCell,

    initialize: function(options){
        this.collection = new backbone.Collection();
    },

    onShow: function(){
        this.collection.reset(this.model.get('tasks'));
    }
});

exports.DashboardUserCell = DashboardUserCell;

});
