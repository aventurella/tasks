define(function(require, exports, module) {

var $ = require('jquery');
var _ = require('underscore');
var stickit = require('backbone/stickit');
var marionette = require('marionette');

var vent = require('built/app/vent').vent;
var modals = require('built/app/modals');
var activity = require('built/app/activity');
var keys = require('built/app/keys');

var sidebarEvents = require('app/sidebar/events');
var projectEvents = require('app/projects/events');
var SidebarView = require('app/sidebar/views/sidebar').SidebarView;
var getSettings = require('app/settings/defaults').getSettings;
var session     = require('app/session/session');

var AccountFormView = require('app/modals/views/account').AccountFormView;
var ProjectDetailView = require('app/projects/views/detail').ProjectDetailView;
var DashboardView = require('app/organization/views/dashboard').DashboardView;
var SessionInitializationView = require('app/modals/views/session').SessionInitializationView;
var SockController = require('app/sockets/sock').SockController;
var HotkeyController = require('app/hotkeys/hotkeys').HotkeyController;
var Tasks = require('app/projects/collections/tasks').Tasks;

var hotkeys = require('app/hotkeys/hotkeys');

var ApplicationDelegate = marionette.Controller.extend({

    initialize: function(options){
        _.bindAll(this, 'beginApplication', 'createTask');

        this.app = options.app;
        this.BUILT();

        this.tasks = new Tasks();
        this.socketController = new SockController({tasks: this.tasks});

        var currentSettings = getSettings();
        var token = currentSettings.getToken();

        var deferred = $.Deferred();
        deferred.then(this.beginApplication);

        if (!token){
            this.promptForCredentials(deferred);
            return;
        }

        this.verifyToken(token, deferred);
    },

    beginApplication: function(token){

        $(document).ajaxSend(function(e, request){
            request.setRequestHeader('Authorization', 'Bearer ' + token);
        });

        var currentSettings = getSettings();
        this.sidebarView = new SidebarView({settings:currentSettings});

        this.listenTo(this.sidebarView, sidebarEvents.DASHBOARD_ORG, this.wantsOrgDashboard);
        this.listenTo(this.sidebarView, sidebarEvents.SELECT_PROJECT, this.wantsChangeProject);
        this.listenTo(this.sidebarView, sidebarEvents.DESELECT_PROJECT, this.wantsClearProject);

        this.app.sidebar.show(this.sidebarView);
    },

    wantsOrgDashboard: function(){
        this.currentProjectView = null;

        if (this.currentProjectView){
            this.stopListening(this.currentProjectView, projectEvents.TOGGLE_SIDEBAR, this.wantsToggleSidebar);
        }

        var dashboard = new DashboardView({
            projects: this.sidebarView.projectListView.collection
        });

        this.app.projectDetail.show(dashboard);

    },

    wantsChangeProject: function(project){
        this.showProject(project);
    },

    wantsClearProject: function(){
        this.clearProject();
    },

    showProject: function(project){
        var tasks = this.tasks;
        tasks.reset();
        tasks.projectId = project.get('id');

        var projectView = new ProjectDetailView({
            model: project,
            tasks: tasks
        });

        var currentSettings = getSettings();
        this.socketController.setActiveProjectId(project.get('id'));
        currentSettings.setCurrentProjectId(project.get('id'));

        if (this.currentProjectView){
            this.stopListening(this.currentProjectView, projectEvents.TOGGLE_SIDEBAR, this.wantsToggleSidebar);
        }

        this.app.projectDetail.show(projectView);
        this.listenTo(projectView, projectEvents.TOGGLE_SIDEBAR, this.wantsToggleSidebar);
        this.currentProjectView = projectView;
    },

    clearProject: function(){
        this.socketController.setActiveProjectId(null);
        this.currentProjectView = null;
        this.app.projectDetail.reset();
        this.sidebarView.showProjectsPane(true);
    },

    wantsToggleSidebar: function(){
        var $el = this.sidebarView.$el;

        if($el.parent().hasClass('hide')){
            this.sidebarView.showProjectsPane(true);
        } else {
            this.sidebarView.showProjectsPane(false);
        }
    },

    promptForCredentials: function(deferred){
        var action = modals.presentModal(new AccountFormView());

        var complete = _.bind(function(modalView){
            var account = modalView.getData().model;
            modals.dismissModal();

            this.acquireTokenForAccount(account, deferred);

        }, this);

        action.then(complete);
    },

    acquireTokenForAccount: function(account, deferred){

        modals.presentModal(new SessionInitializationView());
        var self = this;

        var success = function(token){
            setTimeout(function(){
                modals.dismissModal();
                self.verifyToken(token, deferred);
            }, 1300);
        };

        var fail = function(){
            setTimeout(function(){
                modals.dismissModal();
                self.promptForCredentials(deferred);
            }, 1300);
        };

        session.startSession(account).then(success, fail);
    },

    verifyToken: function(token, deferred){
        var self = this;

        var success = function(){
            var currentSettings = getSettings();
            currentSettings.setToken(token);

            // end of the line
            deferred.resolve(token);
        };

        var fail = function(){
            var currentSettings = getSettings();
            currentSettings.setToken('');
            self.promptForCredentials(deferred);
        };

        this.socketController.connect().then(function(){
            self.socketController.login(token).then(success, fail);
        });
    },

    keyDown: function(e){
        var key = keys.getKeyFromEvent(e);

        if(key == 'n'){

            //activity.presentNetworkActivityIndicator();

            this.createTask();
            return true;
        }
    },

    createTask: function(){
        if(this.app.projectDetail.currentView &&
           !this.app.modal.currentView){

            var currentView = this.app.projectDetail.currentView;

            hotkeys.createTask(
                    this.tasks,
                    {tag: currentView.section.currentView.tag,
                     project: currentView.model});
        }
    },

    BUILT: function(){

        // Key Management
        keys.initialize({modals: modals});
        keys.registerInResponderChain(this);

        // Modal Management
        this.listenTo(vent, modals.events.PRESENT, this._presentModal);
        this.listenTo(vent, modals.events.DISMISS, this._dismissModal);

        // Activity Management
        this.listenTo(vent, activity.events.PRESENT, this._presentNetworkActivityIndicator);
        this.listenTo(vent, activity.events.DISMISS, this._dismissNetworkActivityIndicator);
    },

    _presentNetworkActivityIndicator: function(){
        $('body').addClass('loading');
        // throw new Error('No Activity Indicator View Specified');
        //this.app.activity.show(new YourActivityView);
    },

    _dismissNetworkActivityIndicator: function(modalView){
        $('body').removeClass('loading');
        // this.app.activity.close();
    },

    _presentModal: function(modalView){
        this.app.modal.show(modalView);
    },

    _dismissModal: function(modalView){
        this.app.modal.close().then(function(){
            modals.nextModal();
        });
    }
});



exports.ApplicationDelegate = ApplicationDelegate;
exports.vent = vent;
});
