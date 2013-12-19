define(function (require, exports, module) {

var _ = require('underscore');
var marionette = require('marionette');
var getSettings = require('app/settings/defaults').getSettings;
var vent = require('app/vent').vent;
var status = require('app/projects/models/task').status;
var Tasks = require('app/projects/collections/tasks').Tasks;

var XController = marionette.Controller.extend({

    initialize : function(options){
        _.bindAll(this, 'updateTaskLocation');

        this.tasks = new Tasks();
        this.sectionTag = null;

        this.projectDetail = options.region;
        this.listenTo(this.tasks, 'sync', this.onTasksSync);
        this.listenTo(this.options.sockets, 'message', this.onSocketMessage);
    },

    onSocketMessage: function(sender, data){
        this.updateSectionTag();

        if(data.action == 'update'){
            this.updateTask(data);
        }
    },

    updateSectionTag: function(){
        this.sectionTag = this.projectDetail.currentView.section.tag;
    },

    updateTask: function(data){
        var task = this.tasks.get(data.id);

        if(!task) return;

        if(data.status != task.get('status')){
            var from = task.get('status');
            var to = data.status;

            _.defer(this.updateTaskLocation, from, to, task);
        }

        task.set('label', data.label);
        task.set('description', data.description);
        task.set('loe', data.loe);
        task.set('status', data.status);
        task.set('task_type', data.task_type);
    },

    updateTaskLocation: function(from, to, task){
        //if(this.sectionTag == 'in-process' && _.some())
        console.log('changeLocation', from, to, task);
    },

    onTasksSync: function(){
        //console.log('XController.onTasksSync');
    }


});

exports.XController = XController;


});
