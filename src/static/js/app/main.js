define(function(require, exports, module) {

var SidebarView = require('app/sidebar/views/sidebar').SidebarView;
var _ = require('underscore');

var app;

function presentModal(modalView){
    app.modal.show(modalView);
    app.modal.$el.show();

    _.defer(function(){
        modalView.$el.addClass('show');
    });
}

function dismissModal(modalView){
    modalView.$el.removeClass('show');

    setTimeout(function(){
        app.modal.close();
        app.modal.$el.hide();
    }, 200);
}


function main(options){
    app = this;

    app.addRegions({
        window: '#window',
        sidebar: '#sidebar',
        modal: '#modal',
        projectDetail: '#project-detail'
    });

    var sidebarView = new SidebarView({
        projectDetailRegion: app.projectDetail
    });

    app.sidebar.show(sidebarView);
    app.modal.ensureEl();
    app.listenTo(app.vent, 'application:modal:present', presentModal);
    app.listenTo(app.vent, 'application:modal:dismiss', dismissModal);
}

exports.main = main;
});
