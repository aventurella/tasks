define(function(require, exports, module) {

var marionette = require('marionette');
var events = require('../../events');
var status = require('../../models/task').status;
var template = require('hbs!app/projects/templates/cell-todo');

var CellTodoView = marionette.ItemView.extend({
    template: template,
    className: 'task todo',
    tagName: 'li',

    bindings:{
        '.lbl':'label',
        '.description':'description',
    },

    events: {
        'click .action .btn.backlog': 'wantsSetBacklog',
        'click .action .btn.in-progress': 'wantsSetInProgress',
    },

    onRender: function(){
        this.stickit();
    },

    wantsSetBacklog: function(){
        this.model.set('status', status.BACKLOG);
    },

    wantsSetInProgress: function(){
        this.model.set('status', status.IN_PROGRESS);
    }


});

exports.CellTodoView = CellTodoView;

});
