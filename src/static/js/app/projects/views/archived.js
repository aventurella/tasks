define(function(require, exports, module) {

var marionette = require('marionette');
var CellArchivedView = require('./cells/archived').CellArchivedView;
var Tasks = require('../collections/tasks').Tasks;
var tasks = require('../models/task');
var template = require('hbs!app/projects/templates/archived');

var ArchivedView = marionette.ItemView.extend({
    template: template,

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
    },

    getTasks: function(){
        return this._tasks;
    },

    filterTasks: function(collection){
        var result = new Tasks(collection.where({status: tasks.status.ARCHIVED}));
        return result;
    },

    showCollection: function(collection){
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
});


exports.ArchivedView = ArchivedView;
});

