define(function(require, exports, module) {

var backbone = require('backbone');
var url = require('app/shared/model-utils').url;

var status = {
    BACKLOG: 0,
    ACCEPTED: 1,
    IN_PROGRESS: 2,
    COMPLETED: 3,
    ARCHIVED: 4
};



var Task = backbone.Model.extend({
    defaults: {
        label: null,
        description: null,
        project:0,
        status:status.BACKLOG
    },
    url: url
});

exports.Task = Task;
exports.status = status;

});
