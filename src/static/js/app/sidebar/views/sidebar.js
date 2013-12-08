define(function(require, exports, module) {

var marionette = require('marionette');
var backbone = require('backbone');
var FooterView = require('./footer').FooterView;
var ProjectListView = require('./projects').ProjectListView;
var Project = require('../models/project').Project;
var modals = require('app/modals/modals');
var modalEvents = require('app/modals/events');
var NewProjectView = require('app/modals/views/new-project').NewProjectView;
var events = require('../events');
var template = require('hbs!app/sidebar/templates/sidebar');

// this is probably better as a layout.

var SidebarView = marionette.ItemView.extend({
    template: template,
    className: 'view',
    projectDetailRegion: null,

    ui: {
        projectListView: '.menu',
        footerView: '.footer'
    },

    wantsAddProject: function(){
        var action = modals.presentModal(new NewProjectView());
        var self = this;

        var complete = _.bind(function(modalView){
            modals.dismissModal();
            var data = modalView.getData();
            if(data.ok === false) return;

            this.addProject(data.model);
        }, this);

        action.then(complete);
    },

    wantsRemoveProject: function(){
        this.removeCurrentProject();
    },

    wantsSelectProject: function(sender, projectView){
        this.trigger(events.SELECT_PROJECT, projectView.model);
    },

    wantsToggleProjects: function(){
        if(this.$el.parent().hasClass('hide')){
            this.showProjectsPane(true);
        } else {
            this.showProjectsPane(false);
        }
    },

    showProjectsPane: function(bool){
        if(bool){
            this.$el.parent().removeClass('hide');
            return;
        }

        this.$el.parent().addClass('hide');
    },

    removeCurrentProject: function(){
        var activeProject = this.projectListView.activeProject;

        if(activeProject){
            activeProject.model.destroy();
            this.projectListView.activeProject = null;

            this.projectDetailRegion.close();
            this.currentDetail = null;
        }
    },

    addNewProject: function(){
        var obj = new Project();
        this.addProject(obj);
    },

    addProject: function(project){
        this.projectListView.collection.create(project, {wait: true});
    },

    initializeProjectList: function(){
        this.projectListView = new ProjectListView({
            el: this.ui.projectListView
        });

        this.projectListView.bindUIElements();
        this.projectListView.triggerMethod('show', this.projectListView);

        this.listenTo(this.projectListView, events.SELECT_PROJECT, this.wantsSelectProject);
    },

    initializeFooter: function(){
        this.footerView = new FooterView({
            el: this.ui.footerView
        });

        this.footerView.bindUIElements();
        this.footerView.triggerMethod('show', this.footerView);

        this.listenTo(this.footerView, 'project:add', this.wantsAddProject);
        this.listenTo(this.footerView, 'project:remove', this.wantsRemoveProject);
    },

    onShow: function(){
        this.initializeFooter();
        this.initializeProjectList();
    }

});

exports.SidebarView = SidebarView;

});
