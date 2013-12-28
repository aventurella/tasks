define(function(require, exports, module) {

var template = require('hbs!app/projects/templates/cell-backlog');
var TaskView = require('./task').TaskView;

var CellBacklogView = TaskView.extend({
    template: template,
    className: 'task backlog',
    tag: 'backlog'


});

exports.CellBacklogView = CellBacklogView;

});
