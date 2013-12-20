define(function(require, exports, module) {

var _ = require('underscore');
var marionette = require('marionette');
var KeyResponder = require('built/core/responders/keys').KeyResponder;
var ArrayManager = require('built/core/managers/array').ArrayManager;
var modals = require('built/app/modals');

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


var KeyEventController = marionette.Controller.extend({

    initialize: function(options){
        _.bindAll(this, 'processKeys');

        this.keyResponder = new KeyResponder({
            el: $(window),
            keyDown: this.processKeys,
        });
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

exports.KeyEventController = KeyEventController;
exports.getKeyFromEvent = getKeyFromEvent;
exports.registerInResponderChain = registerInResponderChain;
});

