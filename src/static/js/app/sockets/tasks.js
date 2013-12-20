define(function (require, exports, module) {

var marionette = require('marionette');
var Task = require('app/projects/models/task').Task;
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
       var model = this.tasks.get(data.id);
       model.doUpdateModel(data);
    },

    createTask: function(data){
       var model = new Task();
       model.doUpdateModel(data);
       this.tasks.add(model);
    },

    deleteTask: function(data){
        var model = this.tasks.get(data.id);
        this.tasks.remove(model);
    },




});

exports.TasksProtocol = TasksProtocol;


});
