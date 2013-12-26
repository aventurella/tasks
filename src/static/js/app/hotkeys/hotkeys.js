define(function(require, exports, module) {

var _ = require('underscore');
var marionette = require('marionette');
var modals = require('built/app/modals');
var TaskFormView = require('app/modals/views/new-task').TaskFormView;
var status = require('app/projects/models/task').status;

function createTask(tasks, options){

    // required options:
    // {
    //    tag : 'backlog'|'in-process'|'archived'
    //    project: <project model>
    // }
    var deferred = $.Deferred();

    var tag = options.tag ;
    var project = options.project;

    var map = {
        'backlog': status.BACKLOG,
        'active': status.TODO,
        'archived': status.BACKLOG
    };

    var finalize = _.bind(function(view){
        modals.dismissModal();

        var data = view.getData();
        var model;

        if(!data.ok) return;

        model = data.model;
        deferred.resolve(model);

        tasks.add(model);
        model.save();

    }, this);

    modals.presentModal(new TaskFormView({
        project: project,
        status: map[tag] || undefined
    })).then(finalize);

    return deferred.promise();
}

exports.createTask = createTask;
});


