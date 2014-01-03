define(function(require, exports, module) {

var template = require('hbs!app/projects/templates/cell-in-progress');
var TaskView = require('./task').TaskView;

var CellInProgressView = TaskView.extend({
    template: template,
    className: 'task in-progress',
    tag: 'in-progress',
    initialize: function(){
        TaskView.prototype.initialize.apply(this, arguments);
        this.listenTo(this.model, 'change:assigned_email', this.render);
    }
});

exports.CellInProgressView = CellInProgressView;

});
