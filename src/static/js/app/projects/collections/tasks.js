define(function( require, exports, module ){

var backbone = require('backbone');
var activity = require('built/app/activity');
var Task = require('../models/task').Task;
var domain = require('app/settings/defaults').getSettings().getApiDomain();

var Tasks =  backbone.Collection.extend({
    url: domain+'/api/v1/task/',
    model: Task,

    initialize: function(){
        this.pending = {};
    },

    parse: function(response) {
        return response.objects;
    },

    fetch: function(){
        activity.presentNetworkActivityIndicator();
        this.once('sync', this.onFetchComplete);
        return backbone.Collection.prototype.fetch.apply(this, arguments);
    },
    onFetchComplete: function(){
        activity.dismissNetworkActivityIndicator();
    },
});

exports.Tasks = Tasks;

});

