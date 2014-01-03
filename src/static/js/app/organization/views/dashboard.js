define(function(require, exports, module) {

var marionette = require('marionette');
var template = require('hbs!app/organization/templates/dashboard');
var Users = require('../collections/users').Users;

var DashboardView = marionette.ItemView.extend({
    template: template,
    initialize: function(){
        this.collection = new Users();
        this.collection.fetch();
        this.listenTo(this.collection, 'sync', this.onCollectionSync);
    },
    onCollectionSync: function(){
        //  console.log(this.collection.toJSON());
    },
});

exports.DashboardView = DashboardView;

});
