define(function(require, exports, module) {

var template = require('hbs!app/projects/templates/cell-todo');
var TaskView = require('./task').TaskView;

var CellTodoView = TaskView.extend({
    template: template,
    className: 'task todo',
    tag: 'todo'

});

exports.CellTodoView = CellTodoView;

});
