define(function(require, exports, module) {

var _ = require('underscore');
var marionette = require('marionette');
var CellBacklogView = require('./cells/backlog').CellBacklogView;
var events = require('../events');
var Tasks = require('../collections/tasks').Tasks;
var tasks = require('../models/task');
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

    setTasks: function(collection){
        this._tasks = collection;
    },

    getTasks: function(){
        return this._tasks;
    },

    filterTasks: function(collection){
        var result = new Tasks(collection.where({status: tasks.status.BACKLOG}));
        return result;
    },

    showCollection: function(collection){
        this.backlog = new marionette.CollectionView({
            el: this.ui.list,
            itemView: CellBacklogView,
            collection: collection,

            itemViewOptions: function(model, index) {
                if(model.get('task_type') == tasks.task_type.BUG){
                    var ItemView = this.getItemView();
                    return {
                        className: ItemView.prototype.className + ' bug'
                    };
                }
            }
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
        task.set('status', tasks.status.TODO);
        task.save();
        this.removeFromBacklog(task);
    },

    wantsSendToInProgress: function(cell){
        var task = cell.model;
        task.set('status', tasks.status.IN_PROGRESS);
        task.save();
        this.removeFromBacklog(task);
    },

    wantsSendToCompleted: function(cell){
        var task = cell.model;
        task.set('status', tasks.status.COMPLETED);
        task.save();
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

