define(function(require, exports, module) {

var _ = require('underscore');
var marionette = require('marionette');
var dndevents = require('built/core/events/drag');
var CellBacklogView = require('./cells/backlog').CellBacklogView;
var Swimlane = require('./swimlane').Swimlane;
var events = require('../events');
var Tasks = require('../collections/tasks').Tasks;
var tasks = require('../models/task');
var status = require('../models/task').status;
var TaskFormView = require('app/modals/views/new-task').TaskFormView;
var modals = require('built/app/modals');
var template = require('hbs!app/projects/templates/backlog');

var hotkeys = require('app/hotkeys/hotkeys');

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
            'filterTasks');
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

        this.backlog = new Swimlane({
            el: this.ui.list,
            itemView: CellBacklogView,
            status: status.BACKLOG,
            masterList: this.getTasks(),
            collection: new Tasks(collection.where({status:status.BACKLOG}))
        });

        // if you change the sort order of things it happens N times, debounce it
        var changeDebounce = _.debounce(this.onBacklogCollectionChange, 400);
        this.listenTo(this.backlog.collection, 'change', changeDebounce);
        this.listenTo(this.backlog, dndevents.DRAG_END, this._dragDidEnd);
        this.backlog.render();
    },

    onBacklogCollectionChange: function(){
        this.backlog.collection.sort();
        this.backlog.render();
    },

    _dragDidEnd: function(){
        var list = this.backlog.dragDropList.listManager.getArray();
        var index = 0;
        var self = this;
        _.each(list, function($el){
            var view = self.getViewByEl($el);
            // make this silent
            view.model.set('backlog_order', index, {silent:true});
            index ++;
        });
        Backbone.sync('update', this.backlog.collection, {type:'PATCH'});
    },

    getViewByEl: function($el){
        return this.backlog.children.find(function(view){
            if($el == view.$el[0]){
                return $el;
            }
        });
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

        // the collection of all of the tasks
        // has an add listener.
        // createTask will add to the global collection
        // triggering that add which will drop it into
        // the backlog list if applicable.

        hotkeys.createTask(
            this.getTasks(),
            {tag: this.tag, project: this.model});
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

