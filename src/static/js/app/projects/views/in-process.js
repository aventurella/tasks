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
    },

    modelDidChange: function(model){
        this.ui.projectName.text(model.get('label'));
    }

});

exports.InProcessView = InProcessView;

});
