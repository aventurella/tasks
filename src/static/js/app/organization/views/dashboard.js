define(function(require, exports, module) {

var marionette = require('marionette');
var Users = require('../collections/users').Users;
var DashboardUsersView = require('./dashboard-users').DashboardUsersView;
var DashboardProjectsView = require('./dashboard-projects').DashboardProjectsView;
var template = require('hbs!app/organization/templates/dashboard');

var DashboardView = marionette.Layout.extend({
    template: template,

    regions: {
        section: '#section'
    },

    initialize: function(options){
        this.collection = new Users();
        this.projects = options.projects;
        this.data = this.load();



    },

    load: function(){
        var deferred = $.Deferred();
        var collection = this.collection;

        collection.fetch().then(function(){
            deferred.resolve(collection);
        });

        return deferred.promise();
    },

    showContext: function(view){
        this.section.show(view);
    },

    onShow: function(){
        this.showContext(new DashboardProjectsView({
            data: this.data
        }));
    },


});

exports.DashboardView = DashboardView;

});
