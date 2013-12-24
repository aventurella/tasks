define(function( require, exports, module ){

var backbone = require('backbone');
var Task = require('../models/task').Task;
var domain = require('app/settings/defaults').getSettings().getApiDomain();

var Tasks =  backbone.Collection.extend({
    url: domain+'/api/v1/task/',
    model: Task,
    parse: function(response) {
        return response.objects;
    }
});

exports.Tasks = Tasks;

});

