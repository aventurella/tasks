define(function(require, exports, module) {

var marionette = require('marionette');
var Tasks = require('../collections/tasks').Tasks;
var InProcessView = require('./in-process').InProcessView;
var BacklogView = require('./backlog').BacklogView;
var ArchivedView = require('./archived').ArchivedView;
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
        'click .tabbar .archived': 'wantsShowArchived',

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

    wantsShowArchived: function(){
        this.showArchived();
    },

    showBacklog: function(){
        this.section.show(new BacklogView({
            model: this.model,
            tasks: this.tasks}));
    },

    showInProcess: function(){
        this.section.show(new InProcessView({
            model: this.model,
            tasks: this.tasks}));
    },

    showArchived: function(){
        this.section.show(new ArchivedView({
            model: this.model,
            tasks: this.tasks}));
    },

    loadTasks: function(){
        var deferred = $.Deferred();

        tasks = new Tasks();
        tasks.fetch({data: {project__id: this.model.get('id')}});

        tasks.once('sync', function(){
            deferred.resolve(tasks);
        });

        return deferred.promise();
    },

    onRender: function(){
        this.tasks = this.loadTasks();
        this.showInProcess();
    }


});


exports.ProjectDetailView = ProjectDetailView;
});

