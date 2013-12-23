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
    },

    onRender: function(){
        _.bindAll(this, 'wantsCancelWithKeys', 'wantsSaveWithKeys');

        this.keyResponder = new KeyResponder({
            cancelOperation: this.wantsCancelWithKeys,
        });
        this.keyResponder.registerKeyEquivalentWithString(
            'command + enter',
            this.wantsSaveWithKeys);

        this.stickit();
        this.ui.label.focus();
    },

    getData: function(){
        return this._data;
    },

    wantsSave: function(){
        var self = this;
        this.model.save().then(function(){
            self._data = {ok: true, model: self.model};
            self.trigger(events.COMPLETE);
        });
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


