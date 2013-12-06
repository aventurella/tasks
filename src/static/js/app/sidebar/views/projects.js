define(function(require, exports, module) {

var marionette = require('marionette');
var backbone = require('backbone');
var ProjectCell = require('./cells/project-cell').ProjectCell;
var Projects = require('../collections/projects').Projects;

var ProjectListView = marionette.ItemView.extend({

    ui:{
        projects: '.projects'
    },

    onShow: function(){
        // TODO adam, lets convert this to a compositeview instead of a collection in an itemview
        this.projects = new marionette.CollectionView({
            el: this.ui.projects,
            itemView: ProjectCell,
            collection: new Projects()
        });
        this.projects.collection.fetch();

        this.listenTo(this.projects, 'itemview:select', this.projectWantsSelect);
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
