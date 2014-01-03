define(function(require, exports, module) {

var marionette = require('marionette');
var Users = require('../collections/users').Users;
var DashboardUsersView = require('./dashboard-users').DashboardUsersView;
var DashboardProjectsView = require('./dashboard-projects').DashboardProjectsView;
var IndexManager = require('built/core/managers/index').IndexManager;
var KeyResponder = require('built/core/responders/keys').KeyResponder;
var keys = require('built/app/keys');
var cssFocus = require('built/ui/controls/x-css-focus-single');

var template = require('hbs!app/organization/templates/dashboard');

var DashboardView = marionette.Layout.extend({
    template: template,

    regions: {
        section: '#section'
    },

    events: {
        'click .tabbar .users': 'wantsPivotUsers',
        'click .tabbar .projects': 'wantsPivotProjects'
    },

    ui:{
        btnUsers: '.tabbar .users',
        btnProjects: '.tabbar .projects',
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

    showPivotProjects: function(){
        this.indexManager.setIndex(1);
        this.focusManager.focus(this.ui.btnProjects);
        this.showContext(new DashboardProjectsView({
            data: this.data
        }));
    },

    showPivotUsers: function(){
        this.indexManager.setIndex(0);
        this.focusManager.focus(this.ui.btnUsers);
        this.showContext(new DashboardUsersView({
            data: this.data
        }));
    },

    wantsPivotUsers: function(){
        this.showPivotUsers();
    },

    wantsPivotProjects: function(){
        this.showPivotProjects();
    },

    wantsTabbarMoveLeft: function(){
        var index = this.indexManager.previousIndex();
        this.showSectionWithIndex(index);
    },

    wantsTabbarMoveRight: function(){
        var index = this.indexManager.nextIndex();
        this.showSectionWithIndex(index);
    },

    showSectionWithIndex: function(index){
        var map = {
            0: this.showPivotUsers,
            1: this.showPivotProjects
        };

        var action = map[index];
        action();
    },

    onShow: function(){
        this.indexManager = new IndexManager({length: 2});
        this.focusManager = cssFocus.focusManagerWithElements([
            this.ui.btnUsers,
            this.ui.btnProjects], {focusClass: 'selected'});

        this.showPivotProjects();

        keys.registerInResponderChain(this);

        this.keyResponder = new KeyResponder();
        this.keyResponder.registerKeyEquivalentWithString(
            'command + shift + left', this.wantsTabbarMoveLeft);

        this.keyResponder.registerKeyEquivalentWithString(
            'command + shift + right', this.wantsTabbarMoveRight);
    },
});

exports.DashboardView = DashboardView;

});
