define(function(require, exports, module) {

var $ = require('jquery');
var _ = require('underscore');
var marionette = require('marionette');
var backbone = require('backbone');

var events = require('../events');
var KeyResponder = require('built/core/responders/keys').KeyResponder;
var Task = require('app/projects/models/task').Task;
var status = require('app/projects/models/task').status;
var template = require('hbs!../templates/edit-task');
var UserSearchInputSelect = require('./user-search-input-select').UserSearchInputSelect;

// *IMPORTANT*
// For now it's basically the same as TaskFormView
// it's here because comments etc may be added to
// editing a task which would mean we need an alternate
// view representation.
//
// this is probably better expressed as Extending TaskFormView
// rather then a re-implementation.
var EditTaskFormView = marionette.ItemView.extend({
    template: template,

    events: {
        'click .action .btn.save': 'wantsSave',
        'click .action .btn.cancel': 'wantsCancel'
    },

    ui: {
        label: '#inputLabel'
    },

    bindings: {
        'input[name="inputType"]': 'task_type',
        'input[name="inputLOE"]': 'loe',
        '#inputLabel': 'label',
        '#inputDescription': 'description',
        'input[name="inputStatus"]': 'status'
    },

    initialize: function(options){
        this._data = {ok: false};
        _.bindAll(this, 'wantsCancelWithKeys', 'wantsSaveWithKeys');
    },

    onRender: function(){
        this.keyResponder = new KeyResponder({
            cancelOperation: this.wantsCancelWithKeys,
        });
        this.keyResponder.registerKeyEquivalentWithString(
            'command + enter',
            this.wantsSaveWithKeys);

        this.stickit();
        this.ui.label.focus();

        this.userSearchInputSelect = new UserSearchInputSelect({
            el:'.user-search-input-select',
            model:this.model
        });
        this.userSearchInputSelect.render();
    },

    performKeyEquivalent: function(e){
        this.keyResponder.performKeyEquivalent(e);
    },

    keyDown: function(e){
        this.keyResponder.interpretKeyEvents(e);
    },

    getData: function(){
        return this._data;
    },

    wantsSave: function(){
        this._data = {ok: true, model: this.model};
        this.trigger(events.COMPLETE);
    },

    wantsCancel: function(){
        this.trigger(events.COMPLETE);
    },

    wantsSaveWithKeys: function(){
        this.wantsSave();
    },

    wantsCancelWithKeys: function(){
        this.wantsCancel();
    },

    onClose: function(){
        if(this.keyResponder){
            this.keyResponder.close();
            this.keyResponder = null;
        }
    }



});

exports.EditTaskFormView = EditTaskFormView;

});


