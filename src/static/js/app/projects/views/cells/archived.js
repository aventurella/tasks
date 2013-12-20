define(function(require, exports, module) {

var marionette = require('marionette');
var events = require('../../events');
var status = require('../../models/task').status;
var template = require('hbs!app/projects/templates/cell-archived');

var CellArchivedView = marionette.ItemView.extend({
    template: template,
    className: 'task archived',
    tagName: 'li',

    events:{
        'click .action .btn.todo': 'wantsSetTodo',
        'click .action .btn.in-progress': 'wantsSetInProgress',
        'click .action .btn.completed': 'wantsSetCompleted'
    },

    wantsSetTodo: function(){
        this.model.set('status', status.TODO);
    },

    wantsSetInProgress: function(){
        this.model.set('status', status.IN_PROGRESS);
    },

    wantsSetCompleted: function(){
        this.model.set('status', status.COMPLETED);
    }


});

exports.CellArchivedView = CellArchivedView;

});
