define(function(require, exports, module) {

var marionette = require('marionette');
var vent = require('app/vent').vent;

var modalEvents = require('app/modals/events');
var SidebarView = require('app/sidebar/views/sidebar').SidebarView;


var ApplicationDelegate = marionette.Controller.extend({

    initialize: function(options){
        this.app = options.app;

        var sidebarView = new SidebarView({
            projectDetailRegion: this.app.projectDetail
        });

        this.app.sidebar.show(sidebarView);

        this.listenTo(vent, modalEvents.PRESENT, this.presentModal);
        this.listenTo(vent, modalEvents.DISMISS, this.dismissModal);
    },

    presentModal: function(modalView){
        this.app.modal.show(modalView);
        // var modal = this.app.modal;

        // modal.show(modalView);
        // modal.$el.show();

        // _.defer(function(){
        //     modalView.$el.addClass('show');
        // });
    },

    dismissModal: function(modalView){
        this.app.modal.close();
    }
});



exports.ApplicationDelegate = ApplicationDelegate;
exports.vent = vent;
});
