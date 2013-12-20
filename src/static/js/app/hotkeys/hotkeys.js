define(function(require, exports, module) {

var _ = require('underscore');
var marionette = require('marionette');
var KeyResponder = require('built/core/responders/keys').KeyResponder;
var modals = require('app/modals/modals');
var TaskFormView = require('app/modals/views/new-task').TaskFormView;
var status = require('app/projects/models/task').status;


var ArrayManager = require('built/core/managers/array').ArrayManager;

function getKeyFromEvent(e){
    var key = String.fromCharCode(e.which);
    if(!e.shiftKey) key = key.toLowerCase();

    return key;
}

var responderChain = new ArrayManager();

function registerInResponderChain(view){
    view.once('close', function(){
        var array = responderChain.getArray();
        var index = array.indexOf(view);
        responderChain.removeObjectAt(index);
    });

    responderChain.insertObject(view);
}


var HotkeyController = marionette.Controller.extend({

    initialize: function(options){
        _.bindAll(
            this,
            'processKeys',
            'globalHotkeys',
            'wantsHotkeyCreateTask');

        this.regions = {};
        this.tasks = options.tasks;
        this.regions.projectDetail = options.projectDetail;
        this.regions.modal = options.modal;
    },

    start: function(){
        this.registerActions();

        this.keyResponder = new KeyResponder({
            el: $(window),
            keyDown: this.processKeys,
            insertText: this.globalHotkeys
        });
    },

    registerActions: function(){
        var hotkeys = {
            'n': this.wantsHotkeyCreateTask
        };

        // we could probably just add this functionality to
        // projects/details.js, but then our key commands get separated.
        //
        // It might be interesting to look into a system like modal/network
        // activity where you can send key events in a nested view to a
        // central handler.

        this.hotkeys = hotkeys;
        var currentView = this.regions.projectDetail.currentView;
        if(!currentView) return;
    },

    wantsHotkeyCreateTask: function(){
        var currentView = this.regions.projectDetail.currentView;

        // The user does not have a project selected;
        if(!currentView) return;
        if(this.regions.modal.currentView) return;

        var tag = currentView.section.currentView.tag;
        var model = currentView.model;

        var map = {
            'backlog': status.BACKLOG,
            'in-process': status.TODO,
            'archived': status.BACKLOG
        };

        var finalize = _.bind(function(view){
            modals.dismissModal();
            var data = view.getData();
            var model;
            var tasks = this.tasks;

            if(!data.ok) return;

            model = data.model;
            model.save({'wait': true})
                 .then(function(){
                    tasks.add(model);
                 });
        }, this);

        modals.presentModal(new TaskFormView({
            project: model,
            status: map[tag]
        })).then(finalize);
    },

    processKeys: function(sender, e){

        var result;
        var chain;

        // if a modal is present, it consumes all
        // so the buck stops there.
        if (this.processModal(e)) return;

        chain = responderChain.getArray().slice().reverse();

        // First we ask, who in the chain
        // would like to performKeyEquivalent?
        // We don't just send the event in something like
        // a "performKeyAction" we specifically use KeyEquivalent
        // first, because someone in the chain could respond to
        // just the 'enter' for example and the key that was
        // sent was command + shift + enter. In that case
        // if the person that responds to just 'enter' happens
        // to exist first in the chain traversal, we would never
        // get to view in the chain that handles KeyEquivalent.
        // In other words, KeyEquivalent are the most important
        // followed by regular keys.
        //
        // performKeyEquivalent and keyDown idioms come directly
        // from Cocoa key event handling.
        //
        // https://developer.apple.com/librarY/mac/documentation/Cocoa/Conceptual/EventOverview/HandlingKeyEvents/HandlingKeyEvents.html#//apple_ref/doc/uid/10000060i-CH7-SW1
        //
        // result here will be the itemView that handeled this
        // event.

        result = _.find(chain, function(item){
            if(item.performKeyEquivalent){
                // returns true to stop the chain
                // returns false to keep things moving.
                return item.performKeyEquivalent(e);
            }
        });

        if(result){
            this.completeEvent(e);
            return;
        }

        // No one in the chain wanted to handle the KeyEquivalent
        // lets ask them if they would like to handle the plain
        // key event:

        result = _.find(chain, function(item){
            if(item.keyDown){
                // returns true to stop the chain
                // returns false to keep things moving.
                return item.keyDown(e);
            }
        });

        if(result) {
            this.completeEvent(e);
            return;
        }

        // No one wanted the keyDown handling. So lets last this
        // controller.
        //
        // result will now be a boolean, not an view.

        result = this.keyResponder.performKeyEquivalent(e);

        if(!result){
            this.keyResponder.interpretKeyEvents([e]);
        }
    },

    processModal: function(e){
        // a modal is present, so lets ask that first
        // then bail if nothing
        var currentModal = modals.getCurrentModal();
        var result;

        if(currentModal){
            var view = currentModal.view;

            if(view.performKeyEquivalent){
                // returns true to stop the chain
                // returns false to keep things moving.
                if (view.performKeyEquivalent(e)){
                    this.completeEvent(e);
                    return;
                }
            }

            if(view.keyDown){
                // returns true to stop the chain
                // returns false to keep things moving.
                view.keyDown(e);
            }

            return true;
        }

        return false;
    },

    globalHotkeys: function(sender, e){
        var key = getKeyFromEvent(e);
        var action = this.hotkeys[key];

        if(action){
            this.completeEvent(e);
            action();
        }
    },

    completeEvent: function(e){
        e.preventDefault();
        e.stopImmediatePropagation();
    }


});

exports.HotkeyController = HotkeyController;
exports.registerInResponderChain = registerInResponderChain;
});

