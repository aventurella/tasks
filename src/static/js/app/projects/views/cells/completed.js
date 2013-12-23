define(function(require, exports, module) {

var template = require('hbs!app/projects/templates/cell-completed');
var TaskView = require('./task').TaskView;

var CellCompletedView = TaskView.extend({
    template: template,
    className: 'task completed',

});

exports.CellCompletedView = CellCompletedView;

});
