define(function(require, exports, module) {

var _ = require('underscore');
var marionette = require('marionette');
var backbone = require('backbone');
var modals = require('app/modals/modals');
var modalEvents = require('app/modals/events');
var status = require('../models/task').status;
var Swimlane = require('./swimlane').Swimlane;
var Task = require('../models/task').Task;
var Tasks = require('../collections/tasks').Tasks;
var CellTodoView = require('./cells/todo').CellTodoView;
var CellInProgressView = require('./cells/in-progress').CellInProgressView;
var CellCompletedView = require('./cells/completed').CellCompletedView;

var events = require('../events');
var template = require('hbs!app/projects/templates/in-process');

var InProcessView = marionette.ItemView.extend({
    template: template,
    className: 'details',

    ui:{
        todo: '.swimlanes .lane.todo',
        inProgress: '.swimlanes .lane.in-progress',
        completed: '.swimlanes .lane.completed',
    },

    events: {
        'click .swimlanes .lane.backlog .heading .action': 'wantsAddToBacklog',
    },

    initialize: function(options){
        _.bindAll(this, 'showSwimlanes', 'modelDidChange');
        this.options = options;
        this.swimlanes = {};
    },

    onShow: function(){

        this.options.tasks.then(this.showSwimlanes);
        this.listenTo(this.model, 'change', this.modelDidChange);
    },

    onClose: function(){

        _.each(this.swimlanes, function(value){
            value.close();
        });
    },

    wantsAddToBacklog: function(){
        var taskForm = new TaskFormView({project:this.model});
        var modalView = modals.presentModal(taskForm);

        if(modalView){
            modalView.once(modalEvents.COMPLETE, this.taskModalComplete, this);
        }
    },

    taskModalComplete: function(modalView){
        var data = modalView.getData();
        modals.dismissModal();

        if (data.ok === false) return;
        this.swimlaneTodo.collection.add(data.model);
    },

    addToBacklog: function(){
        var task = new Task({label: 'New Task'});
        this.swimlaneTodo.collection.add(task);
    },

    showSwimlanes: function(tasks){
        // the various cells set their models status
        // though user interaction. We listen for that change
        // here and adjust the swimlanes accordingly.
        this.listenTo(tasks, 'change:status', this.taskStatusDidChange);

        var todo = new Swimlane({
            el: this.ui.todo.find('ul')[0],
            itemView: CellTodoView,
            status: status.TODO,
            masterList:tasks,
            collection: new Tasks(tasks.where({status: status.TODO}))
        });

        var inProgress = new Swimlane({
            el: this.ui.inProgress.find('ul'),
            itemView: CellInProgressView,
            status:status.IN_PROGRESS,
            masterList:tasks,
            collection: new Tasks(tasks.where({status:status.IN_PROGRESS}))
        });

        var completed = new Swimlane({
            el: this.ui.completed.find('ul'),
            itemView: CellCompletedView,
            status:status.COMPLETED,
            masterList:tasks,
            collection: new Tasks(tasks.where({status:status.COMPLETED}))
        });

        todo.render();
        inProgress.render();
        completed.render();

        this.swimlanes[status.TODO] = todo;
        this.swimlanes[status.IN_PROGRESS] = inProgress;
        this.swimlanes[status.COMPLETED] = completed;
    },

    taskStatusDidChange: function(model){
        var target = this.swimlanes[model.previous('status')];
        var destination = this.swimlanes[model.get('status')];

        target.collection.remove(model);

        if(destination){
            destination.collection.add(model);
        }

        model.save();

    },

    modelDidChange: function(model){

        // this.ui.projectName.text(model.get('label'));
    }

});

exports.InProcessView = InProcessView;

});
