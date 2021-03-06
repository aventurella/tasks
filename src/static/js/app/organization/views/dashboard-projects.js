define(function(require, exports, module) {

var _ = require('underscore');
var marionette = require('marionette');
var backbone = require('backbone');
var DashboardProjectCell = require('./cells/dashboard-project-cell').DashboardProjectCell;
var template = require('hbs!app/organization/templates/dashboard-projects');

var DashboardProjectsView = marionette.CompositeView.extend({
    template: template,
    itemViewContainer: '.projects',
    itemView: DashboardProjectCell,

    initialize: function(options){
        this.collection = new backbone.Collection();
        options.data.then(_.bind(this.displayUsers, this));
    },

    displayUsers: function(collection){
        // this is the projects view so the users that come
        // though in this collection need to be reformatted a
        // smidge. AKA They need to be stored under the project.
        var projects = {};
        var data = [];

        // these are users
        // {email, tasks[]}
        // tasks are:
        // {label, description, project_id, loe, project}

        function defaultContext(task){
            return {
                label: task.get('project'),
                tasks: []
            };
        }

        function taskComparator(a, b){
            return a.username.localeCompare(b.username);
        }

        function projectComparator(a, b){
            return a.label.localeCompare(b.label);
        }

        collection.each(function(user){
            var ctx = null;
            user.get('tasks').each(function(task){
                var project_id = task.get('project_id');
                ctx = projects[project_id] || null;

                if (!ctx){
                    ctx = defaultContext(task);
                    projects[project_id] = ctx;
                    data.push(ctx);
                }

                ctx.tasks.push({
                    username: user.get('email'),
                    label: task.get('label'),
                    loe: task.get('loe'),
                    description: task.get('description')
                });
            });

            if(ctx) ctx.tasks.sort(taskComparator);
        });

        data.sort(projectComparator);
        this.collection.reset(data);
    }

});

exports.DashboardProjectsView = DashboardProjectsView;

});
