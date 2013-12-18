define(function(require, exports, module) {

var marionette = require('marionette');
var events = require('../../events');
var status = require('../../models/task').status;
var template = require('hbs!app/projects/templates/cell-completed');

var CellCompletedView = marionette.ItemView.extend({
    template: template,
    className: 'task completed',
    tagName: 'li',

    events: {
        'click .action .btn.todo': 'wantsSetTodo',
        'click .action .btn.archive': 'wantsSetArchived'
    },

    wantsSetTodo: function(){
        this.model.set('status', status.TODO);
    },

    wantsSetArchived: function(){
        this.model.set('status', status.ARCHIVED);
    }

});

exports.CellCompletedView = CellCompletedView;

});
