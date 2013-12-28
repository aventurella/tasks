define(function(require, exports, module) {

var marionette = require('marionette');
var template = require('hbs!../templates/socket');


var SocketConnectingView = marionette.ItemView.extend({
    template: template,

});

exports.SocketConnectingView = SocketConnectingView;

});


