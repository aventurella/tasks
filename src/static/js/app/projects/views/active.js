define(function(require, exports, module) {

var _ = require('underscore');
var marionette = require('marionette');
var backbone = require('backbone');
var status = require('../models/task').status;
var Swimlane = require('./swimlane').Swimlane;
var Task = require('../models/task').Task;
var Tasks = require('../collections/tasks').Tasks;
var CellTodoView = require('./cells/todo').CellTodoView;
var CellInProgressView = require('./cells/in-progress').CellInProgressView;
var CellCompletedView = require('./cells/completed').CellCompletedView;

var events = require('../events');
var dndevents = require('built/core/events/drag');
var template = require('hbs!app/projects/templates/active');

var ActiveView = marionette.ItemView.extend({
    template: template,

    // tag representing this view
    tag: 'active',
    className: 'details',

    ui:{
        todo: '.swimlanes .lane.todo',
        inProgress: '.swimlanes .lane.in-progress',
        completed: '.swimlanes .lane.completed',
    },

    initialize: function(options){
        _.bindAll(this, 'showSwimlanes');
        this.options = options;
        this.tasks = options.tasks;
        this.swimlanes = {};
    },

    onShow: function(){

        this.options.tasks.then(this.showSwimlanes);
    },

    onClose: function(){
        _.each(this.swimlanes, function(value){
            value.close();
        });
    },

    showSwimlanes: function(tasks){
        // the various cells set their models status
        // though user interaction. We listen for that change
        // here and adjust the swimlanes accordingly.
        this.listenTo(tasks, 'change:status', this.taskStatusDidChange);

        var todo = new Swimlane({
            el: this.ui.todo.find('ul')[0],
            itemView: CellTodoView,
            status: status.TODO,
            masterList:tasks,
            collection: new Tasks(tasks.where({status: status.TODO}))
        });

        var inProgress = new Swimlane({
            el: this.ui.inProgress.find('ul'),
            itemView: CellInProgressView,
            status:status.IN_PROGRESS,
            masterList:tasks,
            collection: new Tasks(tasks.where({status:status.IN_PROGRESS}))
        });

        var completed = new Swimlane({
            el: this.ui.completed.find('ul'),
            itemView: CellCompletedView,
            status:status.COMPLETED,
            masterList:tasks,
            collection: new Tasks(tasks.where({status:status.COMPLETED}))
        });

        todo.render();
        inProgress.render();
        completed.render();

        this.listenTo(todo, dndevents.DRAG_START, this._dragDidStart);
        this.listenTo(inProgress, dndevents.DRAG_START, this._dragDidStart);
        this.listenTo(completed, dndevents.DRAG_START, this._dragDidStart);

        this.listenTo(todo, dndevents.DRAG_END, this._dragDidEnd);
        this.listenTo(inProgress, dndevents.DRAG_END, this._dragDidEnd);
        this.listenTo(completed, dndevents.DRAG_END, this._dragDidEnd);

        this.swimlanes[status.TODO] = todo;
        this.swimlanes[status.IN_PROGRESS] = inProgress;
        this.swimlanes[status.COMPLETED] = completed;
    },

    _dragDidStart: function(){
        this.swimlanes[status.TODO].$el.addClass('reveal');
        this.swimlanes[status.IN_PROGRESS].$el.addClass('reveal');
        this.swimlanes[status.COMPLETED].$el.addClass('reveal');
    },

    _dragDidEnd: function(){
        this.swimlanes[status.TODO].$el.removeClass('reveal');
        this.swimlanes[status.IN_PROGRESS].$el.removeClass('reveal');
        this.swimlanes[status.COMPLETED].$el.removeClass('reveal');
    },

    taskStatusDidChange: function(model){

        var target = this.swimlanes[model.previous('status')];
        var destination = this.swimlanes[model.get('status')];

        if(target){
            target.collection.remove(model);
        }

        if(destination){
            destination.collection.add(model);
        }

        // model.save();

    }

});

exports.ActiveView = ActiveView;

});
