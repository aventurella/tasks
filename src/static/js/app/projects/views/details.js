define(function(require, exports, module) {

var marionette = require('marionette');
var backbone = require('backbone');
var _ = require('underscore');
var modals = require('app/modals/modals');
var modalEvents = require('app/modals/events');
var Swimlane = require('./swimlane').Swimlane;
var Task = require('../models/task').Task;
var status = require('../models/task').status;
var Tasks = require('../collections/tasks').Tasks;
var TaskFormView = require('app/modals/views/task-form').TaskFormView;
var view = require('hbs!app/projects/templates/details');

var ProjectDetailView = marionette.ItemView.extend({
    template: view,
    className: 'details',

    ui:{
        projectName: '.project-name label',
        backlog: '.swimlanes .lane.backlog',
        inProgress: '.swimlanes .lane.in-progress',
        completed: '.swimlanes .lane.completed',
        toggleButton: '.project-name .pane-action'
    },

    events: {
        'click .swimlanes .lane.backlog .heading .action': 'wantsAddToBacklog',
        'click .project-name .pane-action': 'wantsToggleProjectPane'

    },

    onShow: function(){
        this.collection = new Tasks();
        this.collection.fetch({data:{project__id:this.model.get('id')}});
        this.listenTo(this.collection, 'sync', this.onCollectionSync);
        this.listenTo(this.model, 'change', this.modelDidChange);
    },

    onClose: function(){
        this.swimlaneBacklog.close();
        this.swimlaneInProgress.close();
        this.swimlaneCompleted.close();
    },

    onCollectionSync: function(){
        this.initializeSwimlanes();
    },

    wantsToggleProjectPane: function(){
        var btn = this.ui.toggleButton;
        var label = '>';
        if(btn.text() == '>'){
            label = '<';
        }

        this.trigger('projects:toggle', this);
        btn.text(label);
    },

    wantsAddToBacklog: function(){
        var taskForm = new TaskFormView({project:this.model});
        var modalView = modals.presentModal(taskForm);

        if(modalView){
            modalView.once(modalEvents.COMPLETE, this.taskModalComplete, this);
        }
    },

    taskModalComplete: function(modalView){
        var data = modalView.getData();
        modals.dismissModal();

        if (data.ok === false) return;
        this.swimlaneBacklog.collection.add(data.model);
    },

    addToBacklog: function(){
        var task = new Task({label: 'New Task'});
        this.swimlaneBacklog.collection.add(task);
    },

    initializeSwimlanes: function(){
        this.swimlaneBacklog = new Swimlane({
            el: this.ui.backlog.find('ul')[0],
            status:status.BACKLOG,
            collection: new Tasks(this.collection.where({status:status.BACKLOG}))
        });
        this.swimlaneBacklog.render();

        this.swimlaneInProgress = new Swimlane({
            el: this.ui.inProgress.find('ul'),
            status:status.IN_PROGRESS,
            collection: new Tasks(this.collection.where({status:status.IN_PROGRESS}))
        });
        this.swimlaneInProgress.render();

        this.swimlaneCompleted = new Swimlane({
            el: this.ui.completed.find('ul'),
            status:status.COMPLETED,
            collection: new Tasks(this.collection.where({status:status.COMPLETED}))
        });
        this.swimlaneCompleted.render();
    },

    modelDidChange: function(model){
        this.ui.projectName.text(model.get('label'));
    }

});

exports.ProjectDetailView = ProjectDetailView;

});
