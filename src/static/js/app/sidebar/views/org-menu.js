define(function(require, exports, module) {

var marionette = require('marionette');
var template = require('hbs!app/sidebar/templates/org-menu');

var OrgMenu = marionette.ItemView.extend({
    template: template,

    events: {
        'click .item': 'wantsSelection'
    },

    wantsSelection: function(e){
        var tag = $(e.currentTarget).data('tag');
        this.selectedTag = tag;
        this.trigger('select', tag);
    },
});

exports.OrgMenu = OrgMenu;

});
