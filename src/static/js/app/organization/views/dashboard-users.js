define(function(require, exports, module) {

var marionette = require('marionette');
var backbone = require('backbone');
var DashboardUserCell = require('./cells/dashboard-user-cell').DashboardUserCell;
var template = require('hbs!app/organization/templates/dashboard-users');

var DashboardUsersView = marionette.CompositeView.extend({
    template: template,
    itemViewContainer: '.users',
    itemView: DashboardUserCell,

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


        function taskComparator(a, b){
            return a.project.localeCompare(b.project);
        }

        function userComparator(a, b){
            return a.username.localeCompare(b.username);
        }

        collection.each(function(user){
            var ctx = {};
            ctx.username = user.get('email');
            ctx.tasks = [];

            user.get('tasks').each(function(task){

                ctx.tasks.push({
                    project: task.get('project'),
                    label: task.get('label'),
                    loe: task.get('loe'),
                    description: task.get('description')
                });
            });

            ctx.tasks.sort(taskComparator);
            data.push(ctx);
        });

        data.sort(userComparator);
        this.collection.reset(data);
    }
});

exports.DashboardUsersView = DashboardUsersView;

});
