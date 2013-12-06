define(function(require, exports, module) {

var marionette = require('marionette');
var template = require('hbs!../templates/session');


var SessionInitializationView = marionette.ItemView.extend({
    template: template,

});

exports.SessionInitializationView = SessionInitializationView;

});


