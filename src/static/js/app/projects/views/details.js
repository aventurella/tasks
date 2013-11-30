define(function(require, exports, module) {

var marionette = require('marionette');
var backbone = require('backbone');
var _ = require('underscore');
var Swimlane = require('./swimlane').Swimlane;
var Task = require('../models/task').Task;
var view = require('hbs!app/projects/templates/details');

var ProjectDetailView = marionette.ItemView.extend({
    template: view,
    className: 'details',

    ui:{
        projectName: '.project-name label',
        backlog: '.swimlanes .lane.backlog',
        accepted: '.swimlanes .lane.accepted',
        inProgress: '.swimlanes .lane.in-progress',
        completed: '.swimlanes .lane.completed'
    },

    onShow: function(){
        this.listenTo(this.model, 'change', this.modelDidChange);
        this.initializeSwimlanes();
    },

    initializeSwimlanes: function(){
        var swimlanes = [
        this.ui.backlog,
        this.ui.accepted,
        this.ui.inProgress,
        this.ui.completed
        ];

        _.each(swimlanes, function(lane){
            var dropElement = lane.find('ul');

            var obj = new Swimlane({
                el: dropElement,
                collection: new backbone.Collection()
            });

            obj.collection.add(new Task({label: 'Lorem ipsum dolor sit amet...'}));
            obj.collection.add(new Task({label: 'Lorem ipsum dolor sit amet...'}));
            obj.collection.add(new Task({label: 'Lorem ipsum dolor sit amet...'}));
            obj.collection.add(new Task({label: 'Lorem ipsum dolor sit amet...'}));

        }, this);
    },

    modelDidChange: function(model){
        this.ui.projectName.text(model.get('projectName'));
    }

});

exports.ProjectDetailView = ProjectDetailView;

});
