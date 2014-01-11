define(function(require, exports, module) {

var marionette = require('marionette');
var CompositeViewSorted = require('app/shared/compositeview-sorted').CompositeViewSorted;
var backbone = require('backbone');
var ProjectCell = require('./cells/project-cell').ProjectCell;
var Projects = require('../collections/projects').Projects;
var events = require('../events');

var ProjectListView = CompositeViewSorted.extend({
    itemView : ProjectCell,
    itemViewContainer : '.projects',

    initialize: function(options){
        this.collection = new Projects();
        this.settings = options.settings;
    },

    onShow: function(){
        this.collection.fetch();
        this.on('itemview:select', this.projectWantsSelect);
        this.listenToOnce(this.collection, 'sync', this.onProjectsSynced);
    },

    onProjectsSynced: function(){
        var child;
        this.listenTo(this.collection, 'add', this.onProjectAdd);

        var id = this.settings.getCurrentProjectId();

        if(this.collection.length && id){
            var model = this.collection.get(id) || false;

            if(!model) return;

            child = this.children.findByModel(model);
        }else{
            child = this.children.findByIndex(0);
        }

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
    }

});

exports.ProjectListView = ProjectListView;

});
