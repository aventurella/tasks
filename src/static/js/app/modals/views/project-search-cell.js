define(function(require, exports, module) {

var marionette = require('marionette');
var template = require('hbs!../templates/project-search-cell');
var focus        = require('built/core/events/focus');

var ProjectSearchCell = marionette.ItemView.extend({
    template: template,
    tagName: 'li',
    initialize: function(){
        this.listenTo(this, focus.FOCUS, this.onFocus);
        this.listenTo(this, focus.BLUR, this.onBlur);
    },

    onFocus: function(){
        this.$el.addClass('active');
    },

    onBlur: function(){
        this.$el.removeClass('active');
    }

});

exports.ProjectSearchCell = ProjectSearchCell;

});


