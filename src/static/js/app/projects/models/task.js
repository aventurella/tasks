define(function(require, exports, module) {

var backbone = require('backbone');
var url = require('app/shared/model-utils').url;
var domain = require('app/settings/defaults').getSettings().getApiDomain();

var status = {
    BACKLOG: 0,
    TODO: 1,
    ACCEPTED: 2,
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
    urlRoot: domain+'/api/v1/task/',
    initialize: function(){

    },

    listenToVent: function(){
        var event = 'model:update:task:' + this.get('id');
        this.listenTo(vent, event, this.doUpdateModel);
    },

    doUpdateModel: function(obj){
        this.set('id', obj.id);
        this.set('description', obj.description);
        this.set('label', obj.label);
        this.set('loe', obj.loe);
        this.set('status', obj.status);
        this.set('task_type', obj.task_type);
        this.set('project', '/api/v1/project/'+obj.project+'/');

    },

    defaults: {
        label: null,
        description: null,
        status:status.BACKLOG,
        loe:loe.LOW,
        task_type:task_type.TASK
    },
    url: url
});

exports.Task = Task;
exports.status = status;
exports.loe = loe;
exports.task_type = task_type;

});
