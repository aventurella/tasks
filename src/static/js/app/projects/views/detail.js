define(function(require, exports, module) {

var marionette = require('marionette');
var InProcessView = require('./in-process').InProcessView;
var BacklogView = require('./backlog').BacklogView;
var AcceptedView = require('./accepted').AcceptedView;
var events = require('../events');
var template = require('hbs!app/projects/templates/detail');

var ProjectDetailView = marionette.Layout.extend({
    template: template,

    ui:{
        projectName: '.project-name label',
        toggleButton: '.project-name .pane-action'
    },

    events: {
        'click .project-name .pane-action': 'wantsToggleSidebar'
    },

    regions: {
        section: '#section'
    },

    wantsToggleSidebar: function(){
        var btn = this.ui.toggleButton;
        var label = '>';
        if(btn.text() == '>'){
            label = '<';
        }

        this.trigger(events.TOGGLE_SIDEBAR, this);
        btn.text(label);
    },

    onRender: function(){
        this.section.show(new InProcessView({model: this.model}));
    }


});


exports.ProjectDetailView = ProjectDetailView;
});

