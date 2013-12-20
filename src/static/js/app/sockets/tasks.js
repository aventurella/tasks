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
                // if(data.token == this.token)return;
                this.createTask(data);
       }
    },

    updateTask: function(data){
       var model = this.tasks.get(data.id);
       model.doUpdateModel(data);
    },

    createTask: function(data){
       this.tasks.add(data);
    },




});

exports.TasksProtocol = TasksProtocol;


});
