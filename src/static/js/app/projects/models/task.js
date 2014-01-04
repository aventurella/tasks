define(function(require, exports, module) {

var backbone = require('backbone');
var url = require('app/shared/model-utils').url;
var domain = require('app/settings/defaults').getSettings().getApiDomain();

var status = {
    BACKLOG: 0,
    TODO: 1,
    ACCEPTED: 2, // unused
    IN_PROGRESS: 3,
    COMPLETED: 4,
    ARCHIVED: 5
};

var loe = {
    LOW: 0,
    MEDIUM: 1,
    HIGH: 2,
};

var task_type = {
    TASK: 0,
    BUG: 1,
};


var Task = backbone.Model.extend({
    urlRoot: domain + '/api/v1/task/',
    initialize: function(){

    },

    listenToVent: function(){
        var event = 'model:update:task:' + this.get('id');
        this.listenTo(vent, event, this.doUpdateModel);
    },

    doUpdateModel: function(obj){
        var data = {
            id: obj.id,
            description: obj.description,
            label: obj.label,
            loe: obj.loe,
            status: obj.status,
            assigned_email: obj.assigned_email,
            task_type: obj.task_type,
            backlog_order: obj.backlog_order,
            project: '/api/v1/project/' + obj.project + '/'
        };

        this.set(data);
    },

    parse: function(resp, options){
        if(resp.project.resource_uri){
            resp.project = resp.project.resource_uri;
        }

        return resp;
    },

    defaults: {
        label: null,
        description: null,
        assigned_to: '',
        status:status.BACKLOG,
        loe:loe.LOW,
        task_type:task_type.TASK
    },

    toJSON: function(options) {
        options = options || {};
        if(options.type && options.type == 'PATCH'){
            var response = this.changedAttributes();
            response.resource_uri = this.get('resource_uri');
            return response;
        }
        return _.clone(this.attributes);
    },

    url: url
});

exports.Task = Task;
exports.status = status;
exports.loe = loe;
exports.task_type = task_type;

});
