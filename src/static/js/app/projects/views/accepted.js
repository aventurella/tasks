define(function(require, exports, module) {

var marionette = require('marionette');
var template = require('hbs!app/projects/templates/accepted');

var AcceptedView = marionette.ItemView.extend({
    template: template
});


exports.AcceptedView = AcceptedView;
});

