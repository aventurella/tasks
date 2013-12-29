define(function(require, exports, module) {

var marionette = require('marionette');
var template = require('hbs!../templates/loading');


var LoadingIndicatorView = marionette.ItemView.extend({
    // template: template,
    onRender: function(){
        $('body').addClass('loading');
    },

    onClose: function(){
        $('body').removeClass('loading');
    },

});

exports.LoadingIndicatorView = LoadingIndicatorView;

});


