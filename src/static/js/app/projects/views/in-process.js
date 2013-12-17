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
        _.bindAll(this, 'showSwimlanes');
        this.options = options;
    },

    onShow: function(){

        this.options.tasks.then(this.showSwimlanes);
        this.listenTo(this.model, 'change', this.modelDidChange);
    },

    onClose: function(){
        this.swimlaneTodo.close();
        this.swimlaneInProgress.close();
        this.swimlaneCompleted.close();
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

        this.swimlaneTodo = new Swimlane({
            el: this.ui.todo.find('ul')[0],
            itemView: CellTodoView,
            status: status.TODO,
            collection: new Tasks(tasks.where({status: status.TODO}))
        });

        this.swimlaneInProgress = new Swimlane({
            el: this.ui.inProgress.find('ul'),
            itemView: CellInProgressView,
            status:status.IN_PROGRESS,
            collection: new Tasks(tasks.where({status:status.IN_PROGRESS}))
        });

        this.swimlaneCompleted = new Swimlane({
            el: this.ui.completed.find('ul'),
            itemView: CellCompletedView,
            status:status.COMPLETED,
            collection: new Tasks(tasks.where({status:status.COMPLETED}))
        });

        this.swimlaneTodo.render();
        this.swimlaneInProgress.render();
        this.swimlaneCompleted.render();

        var actions = {
            'todo': {
                swimlane: this.swimlaneTodo,
                events: {}
            },

            'inProgress': {
                swimlane: this.swimlaneInProgress,
                events: {}
            },

            'completed': {
                swimlane: this.swimlaneCompleted,
                events: {}
            }
        };

        actions.todo.events[events.BACKLOG] = this.wantsSendToBacklog;
        actions.todo.events[events.IN_PROGRESS] = this.wantsSendToInProgress;

        actions.inProgress.events[events.TODO] = this.wantsSendToTodo;
        actions.inProgress.events[events.COMPLETED] = this.wantsSendToCompleted;

        actions.completed.events[events.TODO] = this.wantsSendToTodo;
        actions.completed.events[events.ARCHIVED] = this.wantsSendToArchived;

        _.each(actions, function(value){

            _.each(value.events, function(handler, eventName){
                // console.log('itemview:' + eventName);
                this.listenTo(value.swimlane, 'itemview:' + eventName, handler);
            }, this);

        }, this);
    },

    wantsSendToBacklog: function(view, obj){
        view.swimlane.collection.remove(view.model);
        view.model.set('status', status.BACKLOG);
        view.model.save();
    },

    wantsSendToTodo: function(view, obj){
        view.swimlane.collection.remove(view.model);
        view.model.set('status', status.TODO);
        this.swimlaneTodo.collection.add(view.model);
        view.model.save();
    },

    wantsSendToInProgress: function(view){
        view.swimlane.collection.remove(view.model);
        view.model.set('status', status.IN_PROGRESS);
        this.swimlaneInProgress.collection.add(view.model);
        view.model.save();
    },

    wantsSendToCompleted: function(view){
        view.swimlane.collection.remove(view.model);
        view.model.set('status', status.COMPLETED);
        this.swimlaneCompleted.collection.add(view.model);
        view.model.save();
    },

    wantsSendToArchived: function(view){
        view.swimlane.collection.remove(view.model);
        view.model.set('status', status.ARCHIVED);
        view.model.save();
    },

    modelDidChange: function(model){
        this.ui.projectName.text(model.get('label'));
    }

});

exports.InProcessView = InProcessView;

});
