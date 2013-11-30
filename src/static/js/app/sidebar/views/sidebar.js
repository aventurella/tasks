define(function(require, exports, module) {

var marionette = require('marionette');
var backbone = require('backbone');
var ProjectDetailView = require('app/projects/views/details').ProjectDetailView;
var FooterView = require('./footer').FooterView;
var ProjectListView = require('./projects').ProjectListView;
var Project = require('../models/projects').Project;
var view = require('hbs!app/sidebar/templates/sidebar');

// this is probably better as a layout.

var SidebarView = marionette.ItemView.extend({
    template: view,
    className: 'view',
    projectDetailRegion: null,

    ui: {
        projectListView: '.menu',
        footerView: '.footer'
    },

    initialize: function(options){
        this.projectDetailRegion = options.projectDetailRegion;
    },

    wantsAddProject: function(){
        this.addNewProject();
    },

    wantsSelectProject: function(sender, projectView){
        //console.log(projectView.model.get('projectName'));
        this.showProject(projectView.model);
    },

    showProject: function(model){
        this.projectDetailRegion.show(new ProjectDetailView({model: model}));
    },

    addNewProject: function(){
        var obj = new Project({
            projectName: 'New Project'
        });

        this.projectListView.projects.collection.add(obj);
    },

    initializeProjectList: function(){
        this.projectListView = new ProjectListView({
            el: this.ui.projectListView
        });

        this.projectListView.bindUIElements();
        this.projectListView.triggerMethod('show', this.projectListView);

        this.listenTo(this.projectListView, 'project:select', this.wantsSelectProject);
    },

    initializeFooter: function(){
        this.footerView = new FooterView({
            el: this.ui.footerView
        });

        this.footerView.bindUIElements();
        this.footerView.triggerMethod('show', this.footerView);

        this.listenTo(this.footerView, 'project:add', this.wantsAddProject);
    },

    onShow: function(){
        this.initializeFooter();
        this.initializeProjectList();
    }

});

exports.SidebarView = SidebarView;

});
