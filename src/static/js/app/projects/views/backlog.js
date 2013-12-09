define(function(require, exports, module) {

var _ = require('underscore');
var marionette = require('marionette');
var BacklogTaskView = require('./cells/backlog').BacklogTaskView;
var events = require('../events');
var Tasks = require('../collections/tasks').Tasks;
var status = require('../models/task').status;

var TaskFormView = require('app/modals/views/task-form').TaskFormView;
var modals = require('app/modals/modals');
var modalEvents = require('app/modals/events');
var template = require('hbs!app/projects/templates/backlog');

var BacklogView = marionette.ItemView.extend({
    template: template,

    ui: {
        list: 'ul'
    },

    events: {
        'click .btn.add': 'wantsAddToBacklog'
    },

    initialize: function(options){
        _.bindAll(this,
            'showCollection',
            'setTasks',
            'getTasks',
            'filterTasks',
            'addToBacklogModalComplete');

        this.options = options;
    },

    onShow: function(){
        this.options.tasks
                    .then(this.setTasks)
                    .then(this.getTasks)
                    .then(this.filterTasks)
                    .then(this.showCollection);
    },

    setTasks: function(tasks){
        this._tasks = tasks;
    },

    getTasks: function(){
        return this._tasks;
    },

    filterTasks: function(tasks){
        var result = new Tasks(tasks.where({status: status.BACKLOG}));
        return result;
    },

    showCollection: function(collection){
        this.backlog = new marionette.CollectionView({
            el: this.ui.list,
            itemView: BacklogTaskView,
            collection: collection
        });

        this.backlog.render();
        this.listenTo(
            this.backlog,
            'itemview:' + events.TODO,
            this.wantsSendToTodo);

        this.listenTo(
            this.backlog,
            'itemview:' + events.IN_PROGRESS,
            this.wantsSendToInProgress);

        this.listenTo(
            this.backlog,
            'itemview:' + events.COMPLETED,
            this.wantsSendToCompleted);
    },

    wantsSendToTodo: function(cell){
        var task = cell.model;
        task.set('status', status.TODO);
        this.removeFromBacklog(task);
    },

    wantsSendToInProgress: function(cell){
        var task = cell.model;
        task.set('status', status.IN_PROGRESS);
        this.removeFromBacklog(task);
    },

    wantsSendToCompleted: function(cell){
        var task = cell.model;
        task.set('status', status.COMPLETED);
        this.removeFromBacklog(task);
    },


    wantsAddToBacklog: function(){
        var taskForm = new TaskFormView({project: this.model});
        var modalView = modals.presentModal(taskForm);

        modalView.then(this.addToBacklogModalComplete);
    },

    addToBacklogModalComplete: function(modalView){
        var data = modalView.getData();
        modals.dismissModal();

        if (data.ok === false) return;
        this.addToBacklog(data.model);
    },

    removeFromBacklog: function(task){
        this.backlog.collection.remove(task);
    },

    addToBacklog: function(task){
        // update the master list
        // and our filtered collection.
        this.getTasks().add(task);
        this.backlog.collection.add(task);
    }
});


exports.BacklogView = BacklogView;
});

