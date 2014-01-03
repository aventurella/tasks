define(function(require, exports, module) {

var $ = require('jquery');
var _ = require('underscore');
var marionette = require('marionette');
var backbone = require('backbone');
var events = require('../events');
var KeyResponder = require('built/core/responders/keys').KeyResponder;
var Task = require('app/projects/models/task').Task;
var status = require('app/projects/models/task').status;
var template = require('hbs!../templates/new-task');
var UserSearchInputSelect = require('./user-search-input-select').UserSearchInputSelect;

var TaskFormView = marionette.ItemView.extend({
    template: template,

    events: {
        'click .action .btn.create': 'wantsCreate',
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
        var model = options.model || new Task();

        model.set('project', options.project.get('resource_uri'));

        // status.BACKLOG === 0
        // so if this evals to false we win no matter what
        // as it was supposed to be backlog ANYWAY.
        model.set('status', options.status || status.BACKLOG);

        this.model = model;
    },

    onRender: function(){
        _.bindAll(this, 'wantsCancelWithKeys', 'wantsCreateWithKeys');

        this.keyResponder = new KeyResponder({
            cancelOperation: this.wantsCancelWithKeys,
        });

        this.keyResponder.registerKeyEquivalentWithString(
            'command + enter',
            this.wantsCreateWithKeys);

        this.stickit();
        this.ui.label.focus();

        this.userSearchInputSelect = new UserSearchInputSelect({
            el:'.user-search-input-select'
        });
        this.userSearchInputSelect.render();
    },

    performKeyEquivalent: function(e){
        this.keyResponder.performKeyEquivalent(e);
    },

    keyDown: function(e){
        this.keyResponder.interpretKeyEvents(e);
    },

    wantsCreate: function(){
        this._data = {ok: true, model: this.model};
        this.trigger(events.COMPLETE);
    },

    wantsCancel: function(){
        this.trigger(events.COMPLETE);
    },

    wantsCreateWithKeys: function(){
        this.wantsCreate();
    },

    wantsCancelWithKeys: function(){
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


