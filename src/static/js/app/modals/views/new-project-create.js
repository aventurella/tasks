define(function(require, exports, module) {

var marionette = require('marionette');
var Project = require('app/sidebar/models/project').Project;
var events = require('../events');
var template = require('hbs!../templates/new-project-create');


var NewProjectCreateView = marionette.ItemView.extend({
    template: template,

    events: {
        'click .btn.create': 'wantsComplete',
        'keypress input':'onKeypress',
        'click .btn.cancel': 'wantsCancel'
    },

    triggers: {

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

    wantsCancel: function(){
        this.trigger(events.COMPLETE, this.getData());
    },

    wantsComplete: function(){
        this._data = {ok: true, model: this.model};
        this.trigger(events.COMPLETE, this.getData());
    },

    getData: function(){
        return this._data;
    },
    onKeypress: function(e){
        if(e.keyCode == 13){
            this.wantsComplete();
        }
    },
});

exports.NewProjectCreateView = NewProjectCreateView;

});


