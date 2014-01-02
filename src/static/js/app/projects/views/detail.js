define(function(require, exports, module) {

var marionette = require('marionette');
var keys = require('built/app/keys');
var KeyResponder = require('built/core/responders/keys').KeyResponder;
var IndexManager = require('built/core/managers/index').IndexManager;
var cssFocus = require('built/ui/controls/x-css-focus-single');
var Tasks = require('../collections/tasks').Tasks;
var InProcessView = require('./active').ActiveView;
var BacklogView = require('./backlog').BacklogView;
var ArchivedView = require('./archived').ArchivedView;
var events = require('../events');
var template = require('hbs!app/projects/templates/detail');


var ProjectDetailView = marionette.Layout.extend({
    template: template,
    className: 'project-detail-wrapper',

    ui:{
        toggleButton: '.project-name .pane-action',
        btnBacklog: '.tabbar .backlog',
        btnActive: '.tabbar .active',
        btnArchived: '.tabbar .archived'
    },

    events: {
        'click .project-name .pane-action': 'wantsToggleSidebar',
        'click .tabbar .backlog': 'wantsShowBacklog',
        'click .tabbar .active': 'wantsShowActive',
        'click .tabbar .archived': 'wantsShowArchived',
    },

    regions: {
        section: '#section'
    },

    bindings: {
        '.project-name label': 'label'
    },

    initialize: function(options){
        _.bindAll(this,
            'wantsTabbarMoveLeft',
            'wantsTabbarMoveRight',
            'showBacklog',
            'showActive',
            'showArchived');
        this.tasks = options.tasks;
    },

    wantsToggleSidebar: function(){
        this.trigger(events.TOGGLE_SIDEBAR, this);
    },

    wantsShowBacklog: function(){
        this.showBacklog();
    },

    wantsShowActive: function(){
        this.showActive();
    },

    wantsShowArchived: function(){
        this.showArchived();
    },

    showBacklog: function(){
        this.indexManager.setIndex(0);
        this.focusManager.focus(this.ui.btnBacklog);
        this.section.show(new BacklogView({
            model: this.model,
            tasks: this.tasks}));
    },

    showActive: function(){
        this.indexManager.setIndex(1);
        this.focusManager.focus(this.ui.btnActive);
        this.section.show(new InProcessView({
            model: this.model,
            tasks: this.tasks}));
    },

    showArchived: function(){
        this.indexManager.setIndex(2);
        this.focusManager.focus(this.ui.btnArchived);
        this.section.show(new ArchivedView({
            model: this.model,
            tasks: this.tasks}));
    },

    loadTasks: function(){
        var deferred = $.Deferred();

        if (this.loadOperation){
            this.loadOperation.reject();
            this.loadOperation = null;
        }

        this.loadOperation = deferred;

        tasks = this.tasks;
        tasks.fetch({data: {project__id: this.model.get('id')}});

        tasks.once('sync', function(){
            deferred.resolve(tasks);
        });

        return deferred.promise();
    },

    onShow: function(){
        this.focusManager = cssFocus.focusManagerWithElements([
            this.ui.btnBacklog,
            this.ui.btnActive,
            this.ui.btnArchived], {focusClass: 'selected'});

        this.tasks = this.loadTasks();

        this.stickit();

        keys.registerInResponderChain(this);

        this.indexManager = new IndexManager({length: 3});
        this.showActive();

        this.keyResponder = new KeyResponder();
        this.keyResponder.registerKeyEquivalentWithString(
            'command + shift + left', this.wantsTabbarMoveLeft);

        this.keyResponder.registerKeyEquivalentWithString(
            'command + shift + right', this.wantsTabbarMoveRight);
    },

    keyDown: function(e){
        var key = String.fromCharCode(e.which);
        if(!e.shiftKey) key = key.toLowerCase();

        if(key == 's'){
            this.wantsToggleSidebar();
        }
    },

    performKeyEquivalent: function(e){
        return this.keyResponder.performKeyEquivalent(e);
    },

    wantsTabbarMoveLeft: function(){
        var index = this.indexManager.previousIndex();
        this.showSectionWithIndex(index);
    },

    wantsTabbarMoveRight: function(){
        var index = this.indexManager.nextIndex();
        this.showSectionWithIndex(index);
    },

    showSectionWithIndex: function(index){
        var map = {
            0: this.showBacklog,
            1: this.showActive,
            2: this.showArchived
        };

        var action = map[index];
        action();
    },

    onClose: function(){
        if(this.loadOperation.state() == 'pending'){
            this.loadOperation.reject();
        }

        keys.removeFromResponderChain(this);
        this.focusManager.close();
    }

});


exports.ProjectDetailView = ProjectDetailView;
});

