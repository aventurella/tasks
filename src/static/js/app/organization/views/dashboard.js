define(function(require, exports, module) {

var marionette = require('marionette');
var template = require('hbs!app/organization/templates/dashboard');

var DashboardView = marionette.ItemView.extend({
    template: template

});

exports.DashboardView = DashboardView;

});
