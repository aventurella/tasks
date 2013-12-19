define(function(require, exports, module) {

var $ = require('jquery');
var _ = require('underscore');
var stickit = require('backbone/stickit');
var marionette = require('marionette');
var KeyResponder = require('built/core/responders/keys').KeyResponder;

var vent = require('app/vent').vent;
var modalEvents = require('app/modals/events');
var sidebarEvents = require('app/sidebar/events');
var projectEvents = require('app/projects/events');
var SidebarView = require('app/sidebar/views/sidebar').SidebarView;
var getSettings = require('app/settings/defaults').getSettings;
var session     = require('app/session/session');

var modals = require('app/modals/modals');
var AccountFormView = require('app/modals/views/account').AccountFormView;
var ProjectDetailView = require('app/projects/views/detail').ProjectDetailView;
var SessionInitializationView = require('app/modals/views/session').SessionInitializationView;
var SockController = require('app/sock').SockController;
var TaskFormView = require('app/modals/views/new-task').TaskFormView;
var status = require('app/projects/models/task').status;

var XController = require('./x-controller').XController;




var ApplicationDelegate = marionette.Controller.extend({

    initialize: function(options){
        _.bindAll(this,
            'beginApplication',
            'wantsHotKeyCreateTask');

        this.app = options.app;

        this.listenTo(vent, modalEvents.PRESENT, this.presentModal);
        this.listenTo(vent, modalEvents.DISMISS, this.dismissModal);

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

    initializeHotKeys: function(){
        var hotkeys = {
            'n': this.wantsHotKeyCreateTask
        };

        var getKeyFromEvent = function(e){
            var key = String.fromCharCode(e.which);
            if(!e.shiftKey) key = key.toLowerCase();

            return key;
        };

        var processKeys = function(sender, e){
            var key = getKeyFromEvent(e);
            var action = hotkeys[key];

            // dunno if document.body holds for all browsers
            // it does for chrome and safari and firefox
            if(action && e.target == document.body) {
                // being over zelaous here.
                // Another alternative is to let the action
                // decide if it should kill the propagation
                // and prevent default. AKA the action
                // could return true or false and we
                // would make these 2 calls accordingly.
                // for now we kill everything.

                e.preventDefault();
                e.stopImmediatePropagation();

                action();
            }
        };

        this.keyResponder = new KeyResponder({
            el: $(window),
            insertText: processKeys,
            acceptKeyEquivalent: true
        });
    },

    wantsHotKeyCreateTask: function(){

        var currentView = this.app.projectDetail.currentView;

        // The user does not have a project selected;
        if(!currentView) return;
        if(this.app.modal.currentView) return;

        var tag = currentView.section.currentView.tag;
        var model = currentView.model;

        var map = {
            'backlog': status.BACKLOG,
            'in-process': status.TODO,
            'archived': status.BACKLOG
        };

        var finalize = _.bind(function(view){
            console.log(view.getData());
            modals.dismissModal();
        }, this);

        modals.presentModal(new TaskFormView({
            project: model,
            status: map[tag]
        })).then(finalize);
    },

    beginApplication: function(token){

        $(document).ajaxSend(function(e, request){
            request.setRequestHeader('Authorization', 'Bearer ' + token);
        });

        this.xController = new XController({
            sockets: this.socketController,
            region: this.app.projectDetail
        });

        var currentSettings = getSettings();
        this.sidebarView = new SidebarView({settings:currentSettings});


        this.listenTo(this.sidebarView, sidebarEvents.SELECT_PROJECT, this.wantsChangeProject);
        this.listenTo(this.sidebarView, sidebarEvents.DESELECT_PROJECT, this.wantsClearProject);
        this.app.sidebar.show(this.sidebarView);

        this.initializeHotKeys();
    },

    wantsChangeProject: function(project){
        this.showProject(project);
    },

    wantsClearProject: function(){
        this.clearProject();
    },

    showProject: function(project){

        var projectView = new ProjectDetailView({
            model: project,
            tasks: this.xController.tasks});

        this.socketController.setActiveProjectId(project.get('id'));
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

        this.socketController = new SockController();
        this.socketController.connect().then(function(){
            self.socketController.login(token).then(success, fail);
        });

    },

    presentModal: function(modalView){
        this.app.modal.show(modalView);
    },

    dismissModal: function(modalView){
        this.app.modal.close().then(function(){
            modals.nextModal();
        });
    }
});



exports.ApplicationDelegate = ApplicationDelegate;
exports.vent = vent;
});
