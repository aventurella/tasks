define(function(require, exports, module) {

var marionette = require('marionette');
var template = require('hbs!app/projects/templates/backlog');

var BacklogView = marionette.ItemView.extend({
    template: template
});


exports.BacklogView = BacklogView;
});

