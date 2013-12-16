define(function(require, exports, module) {

var marionette = require('marionette');
var template = require('hbs!app/projects/templates/cell-archived');
var events = require('../../events');

var CellArchivedView = marionette.ItemView.extend({
    template: template,
    className: 'task archived',
    tagName: 'li',

    // triggers: {
    //     'click .action .btn.todo': events.TODO,
    //     'click .action .btn.in-progress': events.IN_PROGRESS,
    //     'click .action .btn.completed': events.COMPLETED
    // },

    onShow: function(){
    },


});

exports.CellArchivedView = CellArchivedView;

});
