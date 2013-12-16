define(function(require, exports, module) {

var marionette = require('marionette');
var template = require('hbs!app/projects/templates/cell-completed');
var events = require('../../events');

var CellCompletedView = marionette.ItemView.extend({
    template: template,
    className: 'task completed',
    tagName: 'li',

    events: {
        'click': 'wantsClick'
    },

    triggers: {
        'click .action .btn.todo': events.TODO,
        'click .action .btn.archive': events.ARCHIVED
    },

    onShow: function(){
    },


});

exports.CellCompletedView = CellCompletedView;

});
