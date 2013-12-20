define(function (require, exports, module) {

var marionette = require('marionette');

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
       this.tasks.add(data);
    },

    deleteTask: function(data){
        var model = this.tasks.get(data.id);
        this.tasks.remove(model);
    },




});

exports.TasksProtocol = TasksProtocol;


});
