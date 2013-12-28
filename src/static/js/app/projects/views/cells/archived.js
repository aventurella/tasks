define(function(require, exports, module) {

var template = require('hbs!app/projects/templates/cell-archived');
var TaskView = require('./task').TaskView;

var CellArchivedView = TaskView.extend({
    template: template,
    className: 'task archived',
    tag: 'archived'


});

exports.CellArchivedView = CellArchivedView;

});
