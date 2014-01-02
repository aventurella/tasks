define(function(require, exports, module) {

var marionette = require('marionette');
var backbone = require('backbone');
var keys = require('built/app/keys');
var modals = require('built/app/modals');
var FooterView = require('./footer').FooterView;
var ProjectListView = require('./projects').ProjectListView;
var Project = require('../models/project').Project;
var NewProjectView = require('app/modals/views/new-project').NewProjectView;
var events = require('../events');
var getSettings = require('app/settings/defaults').getSettings;
var template = require('hbs!app/sidebar/templates/sidebar');

var PopupView = require('built/app/popovers').PopupView;
// this is probably better as a layout.

var orgMenuTemplate = require('hbs!app/sidebar/templates/org-menu');
var OrgMenu = marionette.ItemView.extend({
    template: orgMenuTemplate
});

var SidebarView = marionette.ItemView.extend({
    template: template,
    className: 'view',
    projectDetailRegion: null,

    ui: {
        projectListView: '.menu',
        footerView: '.footer',
        orgName: 'h2'
    },

    events: {
        'click h2': 'wantsOrgMenu'
    },

    initialize: function(options){
        this.user = options.settings.getUser();
        this.currentSettings = options.settings;
    },

    wantsOrgMenu: function(){
        var popover = new PopupView({view: new OrgMenu()});
        popover.showRelativeToElement(this.ui.orgName);
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
        this.user.set('hideSidebar', !bool);
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

            if(this.projectDetailRegion){
                this.projectDetailRegion.close();
            }
            this.currentDetail = null;
        }

        if(this.projectListView.children.first()){
            this.projectListView.trigger('itemview:select', this.projectListView.children.first());
        } else {
            this.trigger(events.DESELECT_PROJECT);
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
            el: this.ui.projectListView,
            settings: this.currentSettings
        });

        this.projectListView.bindUIElements();
        this.projectListView.triggerMethod('show', this.projectListView);

        this.listenTo(this.projectListView, events.SELECT_PROJECT, this.wantsSelectProject);
        this.listenToOnce(this.projectListView.collection, 'sync', this.doCheckIfNoProjects);
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

    doCheckIfNoProjects: function(){
        // if they were focused, but then the project was deleted in the cms, need to allow access to side again
        if(!this.projectListView.collection.length){
            this.showProjectsPane(true);
        }
    },

    onShow: function(){
        this.initializeFooter();
        this.initializeProjectList();

        keys.registerInResponderChain(this);

        if(this.user.get('hideSidebar')){
            var $parent = this.$el.parent();
            $parent.hide();
            this.showProjectsPane(false);
            _.delay(function(){
                $parent.show();
            }, 200);
        }
    }

});

exports.SidebarView = SidebarView;

});
