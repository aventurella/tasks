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
        'click .project-name .pane-action': 'wantsToggleSidebar',
        'click .tabbar .backlog': 'wantsShowBacklog',
        'click .tabbar .in-process': 'wantsShowInProcess',
        'click .tabbar .accepted': 'wantsShowAccepted',

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

    wantsShowBacklog: function(){
        this.showBacklog();
    },

    wantsShowInProcess: function(){
        this.showInProcess();
    },

    wantsShowAccepted: function(){
        this.showAccepted();
    },

    showBacklog: function(){
        this.section.show(new BacklogView({model: this.model}));
    },

    showInProcess: function(){
        this.section.show(new InProcessView({model: this.model}));
    },

    showAccepted: function(){
        this.section.show(new AcceptedView({model: this.model}));
    },


    onRender: function(){
        this.showInProcess();
    }


});


exports.ProjectDetailView = ProjectDetailView;
});

