define(function(require, exports, module) {

var template = require('hbs!app/projects/templates/cell-in-progress');
var TaskView = require('./task').TaskView;

var CellInProgressView = TaskView.extend({
    template: template,
    className: 'task in-progress',
    tag: 'in-progress'
});

exports.CellInProgressView = CellInProgressView;

});
