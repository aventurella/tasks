define(function( require, exports, module ){

var backbone = require('backbone');
var Task = require('../models/task').Task;

var Tasks =  backbone.Collection.extend({
     url: 'http://localhost:8000/api/v1/task/',
    model: Task,
    parse: function(response) {
        return response.objects;
    }
});

exports.Tasks = Tasks;

});
