define(function( require, exports, module ){

var backbone = require('backbone');
var activity = require('built/app/activity');
var task = require('../models/task');
var domain = require('app/settings/defaults').getSettings().getApiDomain();

var Tasks =  backbone.Collection.extend({
    url: domain+'/api/v1/task/',
    model: task.Task,
    comparator: 'backlog_order',
    projectId: null,

    initialize: function(){
        this.pending = {};
    },

    parse: function(response) {
        return response.objects;
    },

    loadBacklog: function(){
        return this.tasksForStatus(task.status.BACKLOG);
    },

    loadTodo: function(){
        return this.tasksForStatus(task.status.TODO);
    },

    loadInProgress: function(){
        return this.tasksForStatus(task.status.IN_PROGRESS);
    },

    loadCompleted: function(){
        return this.tasksForStatus(task.status.COMPLETED);
    },

    loadArchived: function(){
        return this.tasksForStatus(task.status.ARCHIVED);
    },

    tasksForStatus: function(status){
        var options = {
            add: true,
            remove: false,
            data: {
            project__id: this.projectId,
            status: status}
        };

        return this.fetch(options);
    },

    fetch: function(){
        activity.presentNetworkActivityIndicator();
        this.once('sync', this.onFetchComplete);
        return backbone.Collection.prototype.fetch.apply(this, arguments);
    },

    onFetchComplete: function(){
        activity.dismissNetworkActivityIndicator();
    },

    toJSON: function(options) {
        var response = this.map(function(model){return model.toJSON(options);});
        response = _.filter(response, function(item){
            return item;
        });

        if(options && options.type == 'PATCH'){
            return {
                objects: response
            };
        }
        return response;
    },
});

exports.Tasks = Tasks;

});

