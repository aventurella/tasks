define(function(require, exports, module) {

var $ = require('jquery');
var _ = require('underscore');
var marionette = require('marionette');
var backbone = require('backbone');
var events = require('../events');
var KeyResponder = require('built/core/responders/keys').KeyResponder;
var template = require('hbs!../templates/task-form');
var Task = require('app/projects/models/task').Task;

var TaskFormView = marionette.ItemView.extend({
    template: template,

    events: {
        'click .actions .btn.create': 'wantsCreate',
        'click .actions .btn.cancel': 'wantsCancel'
    },

    ui: {
        label: '#inputLabel'
    },

    bindings: {
        'input[name="inputType"]': 'task_type',
        'input[name="inputLOE"]': 'loe',
        '#inputLabel': 'label',
        '#inputDescription': 'description',
    },

    initialize: function(options){
        this._data = {ok: false};
        this.model = new Task({project:options.project.get('resource_uri')});
    },

    onRender: function(){
        _.bindAll(this, 'wantsCancelWithKeys', 'wantsCreateWithKeys');

        this.keyResponder = new KeyResponder({
            el: $(window),
            cancelOperation: this.wantsCancelWithKeys,
            acceptKeyEquivalent: true
        });

        this.keyResponder.registerKeyEquivalentWithString(
            'command + enter',
            this.wantsCreateWithKeys);

        this.stickit();
        this.ui.label.focus();
    },

    wantsCreate: function(){
        this.model.save();
        this._data = {ok: true, model: this.model};
        this.trigger(events.COMPLETE);
    },

    wantsCancel: function(){
        this.trigger(events.COMPLETE);
    },

    wantsCreateWithKeys: function(){
        this.keyResponder.close();
        this.keyResponder = null;
        this.wantsCreate();
    },

    wantsCancelWithKeys: function(){
        this.keyResponder.close();
        this.keyResponder = null;
        this.wantsCancel();
    },

    getData: function(){
        return this._data;
    },

    onClose: function(){
        if(this.keyResponder){
            this.keyResponder.close();
            this.keyResponder = null;
        }
    }

});

exports.TaskFormView = TaskFormView;

});


