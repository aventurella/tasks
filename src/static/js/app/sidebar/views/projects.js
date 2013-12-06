define(function(require, exports, module) {

var marionette = require('marionette');
var backbone = require('backbone');
var ProjectCell = require('./cells/project-cell').ProjectCell;
var Projects = require('../collections/projects').Projects;

var ProjectListView = marionette.CompositeView.extend({
    itemView : ProjectCell,
    itemViewContainer : '.projects',

    initialize: function(){
        this.collection = new Projects();
        this.collection.fetch();
    },

    onShow: function(){
        this.on('itemview:select', this.projectWantsSelect);
        this.listenToOnce(this.collection, 'sync', this.onProjectsSynced);
    },

    onProjectsSynced: function(){
        this.listenTo(this.collection, 'add', this.onProjectAdd);

        var child = this.children.findByIndex(0);
        if(child){
            this.projectWantsSelect(child);
        }
    },

    onProjectAdd: function(model){
        var obj = this.children.findByModel(model);
        this.projectWantsSelect(obj);
        obj.wantsStartEditing();
    },

    projectWantsSelect: function(obj){
        if (obj == this.activeProject) return;

        if (this.activeProject){
            this.activeProject.setSelected(false);
        }

        obj.setSelected(true);
        this.activeProject = obj;

        this.trigger('project:select', this, obj);
    }

});

exports.ProjectListView = ProjectListView;

});
