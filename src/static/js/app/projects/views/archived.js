define(function(require, exports, module) {

var marionette = require('marionette');
var template = require('hbs!app/projects/templates/archived');

var ArchivedView = marionette.ItemView.extend({
    template: template,

    initialize: function(options){
        this.options = options;
    },
});


exports.ArchivedView = ArchivedView;
});

