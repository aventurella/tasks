define(function(require, exports, module) {

var marionette = require('marionette');
var view = require('hbs!../templates/task-form');

var TaskFormView = marionette.ItemView.extend({
    template: view,
    className: 'view task',

    triggers: {
        'click .actions .btn.create': 'application:modal:complete',
        'click .actions .btn.cancel': 'application:modal:complete'
    },

    getData: function(){
        return {ok: false};
    }
});

exports.TaskFormView = TaskFormView;

});


