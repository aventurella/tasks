define(function(require, exports, module) {

var marionette = require('marionette');
var events = require('../../events');
var status = require('../../models/task').status;
var template = require('hbs!app/projects/templates/cell-in-progress');

var CellInProgressView = marionette.ItemView.extend({
    template: template,
    className: 'task in-progress',
    tagName: 'li',


    events: {
        'click .action .btn.todo': 'wantsSetTodo',
        'click .action .btn.completed': 'wantsSetCompleted'
    },

    wantsSetTodo: function(){
        this.model.set('status', status.TODO);
    },

    wantsSetCompleted: function(){
        this.model.set('status', status.COMPLETED);
    }


});

exports.CellInProgressView = CellInProgressView;

});
