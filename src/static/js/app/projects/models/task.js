define(function(require, exports, module) {

var backbone = require('backbone');
var url = require('app/shared/model-utils').url;
var vent = require('app/vent').vent;

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
    urlRoot: 'http://localhost:8000/api/v1/task/',
    initialize: function(){
        if(this.get('id')){
            this.listenToVent()
        }else{
            this.once('update sync', function(){
                this.listenToVent()
            })
        }
    },

    listenToVent: function(){
        var event = 'model:update:task:' + this.get('id');
        this.listenTo(vent, event, this.doUpdateModel);
    },

    doUpdateModel: function(obj){
        var self = this;
        _.map(obj, function(value, key){
            if(self.get(key)){
                self.set(key, value);
            }
        })
        // socket returns back
        this.set('project', "/api/v1/project/"+obj.project+"/")
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
