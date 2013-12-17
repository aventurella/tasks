define(function(require, exports, module) {

var marionette = require('marionette');
var template = require('hbs!app/projects/templates/cell-todo');
var events = require('../../events');

var CellTodoView = marionette.ItemView.extend({
    template: template,
    className: 'task todo',
    tagName: 'li',
    bindings:{
        '.lbl':'label'
    },

    triggers: {
        'click .action .btn.backlog': events.BACKLOG,
        'click .action .btn.in-progress': events.IN_PROGRESS,
    },

    onRender: function(){
        this.stickit();
    },


});

exports.CellTodoView = CellTodoView;

});
