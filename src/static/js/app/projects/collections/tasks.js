define(function( require, exports, module ){

var _ = require('underscore');
var backbone = require('backbone');
var activity = require('built/app/activity');
var task = require('../models/task');
var domain = require('app/settings/defaults').getSettings().getApiDomain();

var Tasks =  backbone.Collection.extend({
    url: domain+'/api/v1/task/',
    model: task.Task,
    //comparator: 'backlog_order',

    /*
    sort = function(a, b){
        console.log(a.id, '==', b.id);
        if (a.next == b.id) return -1;
        if(a.prev == b.id) return 1;
        return 1;}

    sort = function(a, b){
    if (a.next == b.id){ return -1 }
    if(a.prev == b.id){return 1;}
    return 1;}

    -- select * from task_taskorder where task_id in (76, 16, 73)
explain analyze WITH RECURSIVE tree (task_id, previous_id, next_id )AS
(
    SELECT
    task_taskorder.task_id,
    task_taskorder.previous_id,
    task_taskorder.next_id
    FROM task_taskorder
    --WHERE task_taskorder.project_id = 3
    --AND task_taskorder.status = 3
    --AND task_taskorder.previous_id = 0
    WHERE task_taskorder.task_id = 161114

    UNION ALL

    SELECT tto.task_id, tto.previous_id, tto.next_id
    FROM task_taskorder AS tto
    JOIN tree as t
    ON (t.next_id = tto.task_id)
)
SELECT
tree.task_id,
task_task.label,
task_task.description,
task_task.status
FROM tree
INNER JOIN task_task on tree.task_id = task_task.id
LIMIT 15
    */

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

    loadInitialActiveTasks: function(){
        return this.tasksForStatus();
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

    tasksForStatus: function(status, maxId){

        var data = {
            project__id: this.projectId,
        };

        if(!_.isUndefined(status) && !_.isNull(status))
            data.status = status;

        if(maxId) data.max_id = maxId;

        var options = {
            add: true,
            remove: false,
            data: data
        };

        return this.fetch(options);
    },

    fetch: function(){
        //activity.presentNetworkActivityIndicator();
        this.once('sync', this.onFetchComplete);
        return backbone.Collection.prototype.fetch.apply(this, arguments);
    },

    onFetchComplete: function(){
        //activity.dismissNetworkActivityIndicator();
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

