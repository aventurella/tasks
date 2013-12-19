define(function(require, exports, module) {

var $ = require('jquery');
var _ = require('underscore');
var stickit = require('backbone/stickit');
var marionette = require('marionette');
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


var ApplicationDelegate = marionette.Controller.extend({

    initialize: function(options){
        _.bindAll(this,'beginApplication')
        this.app = options.app;

        this.listenTo(vent, modalEvents.PRESENT, this.presentModal);
        this.listenTo(vent, modalEvents.DISMISS, this.dismissModal);

        var currentSettings = getSettings();
        var token = currentSettings.getToken();

        var deferred = $.Deferred();
        deferred.then(this.beginApplication);

        if (token){
            this.promptForCredentials(deferred);
            return;
        }

        this.verifyToken(token, deferred);

        // this.listenTo(this.socketController, 'login:fail', this.beginLoginFlow)
        // this.listenTo(this.socketController, 'login:success', this.onLoginSuccess)
    },

    // onLoginSuccess: function(){
    //     this.beginApplication(token);
    // },

    beginApplication: function(token){

        $(document).ajaxSend(function(e, request){
            request.setRequestHeader('Authorization', 'Bearer ' + token);
        });


        this.sidebarView = new SidebarView({});


        this.listenTo(this.sidebarView, sidebarEvents.SELECT_PROJECT, this.wantsChangeProject);
        this.app.sidebar.show(this.sidebarView);
    },

    wantsChangeProject: function(project){
        this.showProject(project);
    },

    showProject: function(project){
        var projectView = new ProjectDetailView({model: project});
        this.socketController.setActiveProjectId(project.get('id'));
        if (this.currentProjectView){
            this.stopListening(this.currentProjectView, projectEvents.TOGGLE_SIDEBAR, this.wantsToggleSidebar);
        }

        this.app.projectDetail.show(projectView);
        this.listenTo(projectView, projectEvents.TOGGLE_SIDEBAR, this.wantsToggleSidebar);
        this.currentProjectView = projectView;
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
