define(function( require, exports, module ){

var backbone = require('backbone');
var modals = require('built/app/modals');
var Task = require('../models/task').Task;
var domain = require('app/settings/defaults').getSettings().getApiDomain();
var LoadingIndicatorView = require('app/modals/views/loading').LoadingIndicatorView;

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
        modals.presentModal(new LoadingIndicatorView());
        this.once('sync', this.onFetchComplete);
        return backbone.Collection.prototype.fetch.apply(this, arguments);
    },
    onFetchComplete: function(){
        modals.dismissModal();
    },
});

exports.Tasks = Tasks;

});

