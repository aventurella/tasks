define(function(require, exports, module) {

var marionette = require('marionette');
var $ = require('jquery');
var _ = require('underscore');
var KeyResponder = require('built/core/responders/keys').KeyResponder;
var view = require('hbs!../templates/task-form');

var TaskFormView = marionette.ItemView.extend({
    template: view,

    triggers: {
        'click .actions .btn.create': 'application:modal:complete',
        'click .actions .btn.cancel': 'application:modal:complete'
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
    },

    wantsCreateWithKeys: function(){
        this.keyResponder.close();
        this.keyResponder = null;
        this.trigger('application:modal:complete');
    },

    wantsCancelWithKeys: function(){
        this.keyResponder.close();
        this.keyResponder = null;
        this.trigger('application:modal:complete');
    },

    getData: function(){
        return {ok: false};
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


