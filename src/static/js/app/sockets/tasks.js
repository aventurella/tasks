define(function (require, exports, module) {

var marionette = require('marionette');
var Task = require('app/projects/models/task').Task;
var pendingIdForTask = require('app/shared/model-utils').pendingIdForTask;

require('sockjs');

var TasksProtocol = marionette.Controller.extend({

    initialize : function(options){
        this.tasks = options.tasks;
    },

    handleMessage: function(data){
        switch(data.action){
            case 'update':
                this.updateTask(data);
                break;
            case 'create':
                this.createTask(data);
                break;
            case 'delete':
                this.deleteTask(data);
                break;
        }
    },

    updateTask: function(data){
        var Bridge = window.Bridge || undefined;
        if(Bridge) Bridge.taskDidChange(data);
        var model = this.tasks.get(data.id);
        model.doUpdateModel(data);
    },

    createTask: function(data){
        var model = new Task();
        model.doUpdateModel(data);

        var pendingId = pendingIdForTask(model);
        var pendingModel = this.tasks.pending[pendingId];

        if(pendingModel){
            pendingModel.set('id', model.get('id'));
            delete this.tasks.pending[pendingId];
            return;
        }

        this.tasks.add(model);

    },

    deleteTask: function(data){
        var model = this.tasks.get(data.id);
        model.trigger('destroy', model, model.collection);
    },




});

exports.TasksProtocol = TasksProtocol;


});
