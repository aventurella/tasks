define(function(require, exports, module) {

var marionette = require('marionette');
var template = require('hbs!app/organization/templates/dashboard-users');

var DashboardUsersView = marionette.ItemView.extend({
    template: template,

    initialize: function(options){
        this.projects = options.projects;
        options.data.then(_.bind(this.displayUsers, this));
    },

    displayUsers: function(collection){
        console.log(collection.toJSON());
    }
});

exports.DashboardUsersView = DashboardUsersView;

});
