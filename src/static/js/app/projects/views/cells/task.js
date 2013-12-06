define(function(require, exports, module) {

var marionette = require('marionette');
var view = require('hbs!app/projects/templates/task');

var TaskView = marionette.ItemView.extend({
    template: view,
    className: 'task',
    tagName: 'li',

    events: {
        'click': 'wantsClick'
    },

    onShow: function(){
        console.log('called');
    },

    wantsClick: function(){
        console.log('CLICKITY CLACK');
    }

});

exports.TaskView = TaskView;

});
