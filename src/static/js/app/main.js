define(function(require, exports, module) {

var ApplicationDelegate = require('./delegate').ApplicationDelegate;
var ModalRegion = require('app/modals/region').ModalRegion;

function main(options){
    var app = this;
    app.addRegions({
        modal: ModalRegion,
        activity: '#activity',
        sidebar: '#sidebar',
        projectDetail: '#project-detail'
    });

    // global
    window.application = new ApplicationDelegate({app: app});
}

exports.main = main;
});

