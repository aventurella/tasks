define(function(require, exports, module) {

var SidebarView = require('app/sidebar/views/sidebar').SidebarView;

function main(options){
    var app = this;

    app.addRegions({
        window: '#window',
        sidebar: '#sidebar',
        projectDetail: '#project-detail'
    });

    var sidebarView = new SidebarView({
        projectDetailRegion: app.projectDetail
    });

    //app.surface.show(surfaceView);
    app.sidebar.show(sidebarView);
}

exports.main = main;
});
