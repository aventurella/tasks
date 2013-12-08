define(function(require, exports, module) {

var marionette = require('marionette');
var template = require('../templates/accepted');

var AcceptedView = marionette.ItemView.extend({
    template: template
});


exports.AcceptedView = AcceptedView;
});

