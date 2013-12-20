define(function(require, exports, module) {

var _ = require('underscore');
var marionette = require('marionette');
var modals = require('built/app/modals');
var TaskFormView = require('app/modals/views/new-task').TaskFormView;
var status = require('app/projects/models/task').status;

function createTask(tasks, currentView){

    var tag = currentView.section.currentView.tag;
    var model = currentView.model;

    var map = {
        'backlog': status.BACKLOG,
        'in-process': status.TODO,
        'archived': status.BACKLOG
    };

    var finalize = _.bind(function(view){
        modals.dismissModal();
        var data = view.getData();
        var model;
        var tasks = this.tasks;

        if(!data.ok) return;

        model = data.model;
        model.save({'wait': true})
             .then(function(){
                tasks.add(model);
             });
    }, this);

    modals.presentModal(new TaskFormView({
        project: model,
        status: map[tag]
    })).then(finalize);
}

exports.createTask = createTask;
});

