define(function(require, exports, module) {

var _ = require('underscore');
var TaskView = require('./task').TaskView;
var template = require('hbs!app/projects/templates/cell-backlog');

var CellBacklogView = TaskView.extend({
    template: template,
    className: 'task backlog',
    tag: 'backlog',
    events: _.extend(TaskView.prototype.events, {
        'click .btn-default.todo': 'wantsSetTodo'
    })

});

exports.CellBacklogView = CellBacklogView;

});
