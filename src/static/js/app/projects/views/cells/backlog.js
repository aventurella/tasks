define(function(require, exports, module) {

var marionette = require('marionette');
var template = require('hbs!app/projects/templates/cell-backlog');
var events = require('../../events');

var BacklogTaskView = marionette.ItemView.extend({
    template: template,
    className: 'task backlog',
    tagName: 'li',

    events: {
        'click': 'wantsClick'
    },

    triggers: {
        'click .action .btn.todo': events.TODO,
        'click .action .btn.in-progress': events.IN_PROGRESS,
        'click .action .btn.completed': events.COMPLETED
    },

    onShow: function(){
    },


});

exports.BacklogTaskView = BacklogTaskView;

});
