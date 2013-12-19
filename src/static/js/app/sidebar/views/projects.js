define(function(require, exports, module) {

var marionette = require('marionette');
var backbone = require('backbone');
var ProjectCell = require('./cells/project-cell').ProjectCell;
var Projects = require('../collections/projects').Projects;
var events = require('../events');

var ProjectListView = marionette.CompositeView.extend({
    itemView : ProjectCell,
    itemViewContainer : '.projects',

    initialize: function(options){
        this.collection = new Projects();
        this.collection.fetch();
        this.user = options.user;

    },

    onShow: function(){
        this.on('itemview:select', this.projectWantsSelect);
        this.listenToOnce(this.collection, 'sync', this.onProjectsSynced);
    },

    onProjectsSynced: function(){
        this.listenTo(this.collection, 'add', this.onProjectAdd);

        var id = this.user.get('project_id');
        var model = this.collection.get(id);
        var child = this.children.findByModel(model) || this.children.findByIndex(0);
        if(child){
            this.projectWantsSelect(child);
        }
    },

    onProjectAdd: function(model){
        var obj = this.children.findByModel(model);
        this.projectWantsSelect(obj);
    },

    projectWantsSelect: function(obj){
        if (obj == this.activeProject) return;

        if (this.activeProject){
            this.activeProject.setSelected(false);
        }

        obj.setSelected(true);
        this.activeProject = obj;

        this.trigger(events.SELECT_PROJECT, this, obj);

        this.user.set('project_id', obj.model.get('id'));
    }

});

exports.ProjectListView = ProjectListView;

});
