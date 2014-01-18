define(function(require, exports, module) {

var marionette = require('marionette');
var backbone = require('backbone');
var TaskActionsMenuItem = require('./menu-task-actions-item').TaskActionsMenuItem;
var template = require('hbs!app/projects/templates/menu-task-actions');

var TaskActionsMenu = marionette.CompositeView.extend({
    template: template,
    itemViewContainer: '.choices ul',
    itemView: TaskActionsMenuItem,
    tagName: 'ul',
    className: 'dropdown-menu',
    attributes: {role: 'menu'},
    selectedTag: null,

    events: {
        'click .item': 'wantsSelection'
    },

    initialize: function(options){
        options = options || {};
        this.choices = options.choices || [];
        this.collection = new backbone.Collection();
    },

    wantsSelection: function(e){
        var tag = $(e.currentTarget).data('tag');
        this.selectedTag = tag;
        this.trigger('select', tag);
    },

    onRender: function(){
        this.collection.reset(this.choices);
    }
});

exports.TaskActionsMenu = TaskActionsMenu;

});

