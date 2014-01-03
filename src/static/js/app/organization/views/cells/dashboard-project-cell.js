define(function(require, exports, module) {

var marionette = require('marionette');
var backbone = require('backbone');
var DashboardProjectTaskCell = require('./dashboard-project-task-cell').DashboardProjectTaskCell;
var template = require('hbs!app/organization/templates/dashboard-project-cell');

var DashboardProjectCell = marionette.CompositeView.extend({
    template: template,
    tagName: 'li',
    className: 'project',
    itemViewContainer: '.tasks',
    itemView: DashboardProjectTaskCell,

    initialize: function(options){
        this.collection = new backbone.Collection();
    },

    onShow: function(){
        this.collection.reset(this.model.get('tasks'));
    }
});

exports.DashboardProjectCell = DashboardProjectCell;

});
