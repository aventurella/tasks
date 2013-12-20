define(function(require, exports, module) {

var _ = require('underscore');
var marionette = require('marionette');
var CellBacklogView = require('./cells/backlog').CellBacklogView;
var events = require('../events');
var Tasks = require('../collections/tasks').Tasks;
var tasks = require('../models/task');
var TaskFormView = require('app/modals/views/new-task').TaskFormView;
var modals = require('app/modals/modals');
var template = require('hbs!app/projects/templates/backlog');

var BacklogView = marionette.ItemView.extend({
    template: template,

    // tag representing this view
    tag: 'backlog',

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
        this.tasks = options.tasks;
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
        this.listenTo(collection, 'change:status', this.taskStatusDidChange);
        this.listenTo(collection, 'add', this.onTaskAdded);
    },

    onTaskAdded: function(model){
        if( model.get('status') == tasks.status.BACKLOG ){
            this.backlog.collection.add(model);
        }
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
    },

    taskStatusDidChange: function(model){
        // changed TO backlog
        // we don't need to call save here
        // because the only way this can happen is
        // if it's pushed to us, which means it was
        // already saved.

        if(model.get('status') === tasks.status.BACKLOG){
            this.backlog.collection.add(model);
            return;
        }

        // changed FROM backlog
        if(model.previous('status') === tasks.status.BACKLOG){
            this.backlog.collection.remove(model);
            model.save();
        }
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

        if(data.model.get('status') === tasks.status.BACKLOG ){
            this.addToBacklog(data.model);
        } else {
            this.getTasks().add(data.model);
        }

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

