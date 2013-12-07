define(function(require, exports, module) {

var stickit = require('backbone/stickit');
var marionette = require('marionette');
var vent = require('app/vent').vent;

var modalEvents = require('app/modals/events');
var SidebarView = require('app/sidebar/views/sidebar').SidebarView;
var getSettings = require('app/settings/defaults').getSettings;
var session     = require('app/session/session');

var modals = require('app/modals/modals');
var AccountFormView = require('app/modals/views/account').AccountFormView;
var SessionInitializationView = require('app/modals/views/session').SessionInitializationView;

var ApplicationDelegate = marionette.Controller.extend({

    initialize: function(options){
        this.app = options.app;


        this.listenTo(vent, modalEvents.PRESENT, this.presentModal);
        this.listenTo(vent, modalEvents.DISMISS, this.dismissModal);

        var currentSettings = getSettings();
        var token = currentSettings.getToken();

        if (!token){
            this.beginLoginFlow();
            return;
        }

        this.beginApplication();
    },

    beginApplication: function(){
        var sidebarView = new SidebarView({
            projectDetailRegion: this.app.projectDetail
        });

        this.app.sidebar.show(sidebarView);
    },

    beginLoginFlow: function(){
        var modalView = modals.presentModal(new AccountFormView());
        modalView.once(modalEvents.COMPLETE, function(){
                var account = modalView.getData().model;
                modals.dismissModal();
                this.startSession(account);
            }, this);
    },

    startSession: function(account){

        var currentSettings = getSettings();

        modals.presentModal(new SessionInitializationView());
        var self = this;

        var success = function(token){
            currentSettings.setToken(token);
            self.beginApplication();
            setTimeout(function(){
                modals.dismissModal();
            }, 1300);
        };

        var fail = function(){
            setTimeout(function(){
                modals.dismissModal();
                self.beginLoginFlow();
            }, 1300);
        };

        session.startSession(account).then(success, fail);
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
