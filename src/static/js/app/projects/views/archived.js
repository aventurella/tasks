define(function(require, exports, module) {

var marionette = require('marionette');
var CellArchivedView = require('./cells/archived').CellArchivedView;
var Tasks = require('../collections/tasks').Tasks;
var tasks = require('../models/task');
var template = require('hbs!app/projects/templates/archived');

var ArchivedView = marionette.ItemView.extend({
    template: template,

    // tag representing this view
    tag: 'archived',

    ui: {
        list: 'ul'
    },

    initialize: function(options){
        _.bindAll(this,
            'showCollection',
            'setTasks',
            'getTasks',
            'filterTasks');

        this.options = options;
        this.archived = null;
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
        if( model.get('status') == tasks.status.ARCHIVED ){
            this.archived.collection.add(model);
        }
    },

    getTasks: function(){
        return this._tasks;
    },

    filterTasks: function(collection){
        var result = new Tasks(collection.where({status: tasks.status.ARCHIVED}));
        return result;
    },

    showCollection: function(collection){
        collection.comparator = 'last_edited.datetime';
        this.archived = new marionette.CollectionView({
            el: this.ui.list,
            itemView: CellArchivedView,
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

        this.archived.render();
    },

    taskStatusDidChange: function(model){
        // changed TO archived
        // we don't need to call save here
        // because the only way this can happen is
        // if it's pushed to us, which means it was
        // already saved.
        if(model.get('status') === tasks.status.ARCHIVED){
            this.archived.collection.add(model);
            return;
        }

        // changed FROM archived
        if(model.previous('status') === tasks.status.ARCHIVED){
            this.archived.collection.remove(model);
            model.save();
        }
    },

});


exports.ArchivedView = ArchivedView;
});

