define(function(require, exports, module) {

var marionette = require('marionette');
var events = require('../events');
var template = require('hbs!../templates/new-project-existing');

var NewProjectExistingView = marionette.ItemView.extend({
    template: template,

    events: {
        'click .btn.attach': 'wantsComplete'
    },

    triggers: {
        'click .btn.cancel': events.COMPLETE
    },

    ui: {
        input : 'input'
    },

    initialize: function(){
        this._data = {ok: false};
    },

    wantsComplete: function(){
        this._data = {ok: true, model: this.model};
        this.trigger(events.COMPLETE, this.getData());
    },

    onShow: function(){

    },

    getData: function(){
        return this._data;
    },

});

exports.NewProjectExistingView = NewProjectExistingView;

});


