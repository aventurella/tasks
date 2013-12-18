define(function(require, exports, module) {

var marionette = require('marionette');
var Project = require('app/sidebar/models/project').Project;
var events = require('../events');
var template = require('hbs!../templates/new-project-create');


var NewProjectCreateView = marionette.ItemView.extend({
    template: template,

    events: {
        'click .btn.create': 'wantsComplete'
    },

    triggers: {
        'click .btn.cancel': events.COMPLETE
    },

    ui: {
        input : 'input'
    },

    bindings: {
        'input': 'label'
    },

    initialize: function(){
        this._data = {ok: false};
    },

    onShow: function(){
        this.model = new Project();

        this.ui.input.focus();
        this.stickit();
    },

    wantsComplete: function(){
        this._data = {ok: true, model: this.model};
        this.trigger(events.COMPLETE, this.getData());
    },

    getData: function(){
        return this._data;
    },
});

exports.NewProjectCreateView = NewProjectCreateView;

});


