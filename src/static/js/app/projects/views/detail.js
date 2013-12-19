define(function(require, exports, module) {

var marionette = require('marionette');
var Tasks = require('../collections/tasks').Tasks;
var InProcessView = require('./in-process').InProcessView;
var BacklogView = require('./backlog').BacklogView;
var ArchivedView = require('./archived').ArchivedView;
var events = require('../events');
var cssFocus = require('built/ui/controls/x-css-focus-single');
var template = require('hbs!app/projects/templates/detail');

var ProjectDetailView = marionette.Layout.extend({
    template: template,

    ui:{
        projectName: '.project-name label',
        toggleButton: '.project-name .pane-action',
        btnBacklog: '.tabbar .backlog',
        btnInProcess: '.tabbar .in-process',
        btnArchived: '.tabbar .archived'
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
        this.focusManager.focus(this.ui.btnBacklog);
        this.section.show(new BacklogView({
            model: this.model,
            tasks: this.tasks}));
    },

    showInProcess: function(){
        this.focusManager.focus(this.ui.btnInProcess);
        this.section.show(new InProcessView({
            model: this.model,
            tasks: this.tasks}));
    },

    showArchived: function(){
        this.focusManager.focus(this.ui.btnArchived);
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

    onShow: function(){
        this.focusManager = cssFocus.focusManagerWithElements([
            this.ui.btnBacklog,
            this.ui.btnInProcess,
            this.ui.btnArchived], {focusClass: 'active'});

        this.tasks = this.loadTasks();
        this.showInProcess();
    }


});


exports.ProjectDetailView = ProjectDetailView;
});

