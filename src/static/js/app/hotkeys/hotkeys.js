define(function(require, exports, module) {

var _ = require('underscore');
var marionette = require('marionette');
var KeyResponder = require('built/core/responders/keys').KeyResponder;
var modals = require('app/modals/modals');
var TaskFormView = require('app/modals/views/new-task').TaskFormView;
var status = require('app/projects/models/task').status;



function getKeyFromEvent(e){
    var key = String.fromCharCode(e.which);
    if(!e.shiftKey) key = key.toLowerCase();

    return key;
}


var HotkeyController = marionette.Controller.extend({

    initialize: function(options){
        _.bindAll(this, 'processKeys', 'wantsHotKeyCreateTask');

        this.regions = {};
        this.tasks = options.tasks;
        this.regions.projectDetail = options.projectDetail;
        this.regions.modal = options.modal;
    },

    start: function(){
        this.registerActions();
        this.keyResponder = new KeyResponder({
            el: $(window),
            insertText: this.processKeys,
            acceptKeyEquivalent: true
        });
    },

    registerActions: function(){
        var hotkeys = {
            'n': this.wantsHotKeyCreateTask
        };

        this.hotkeys = hotkeys;
    },

    wantsHotKeyCreateTask: function(){
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
        var key = getKeyFromEvent(e);
        var action = this.hotkeys[key];

        // dunno if document.body holds for all browsers
        // it does for chrome and safari and firefox
        if(action && e.target == document.body) {
            // being over zelaous here.
            // Another alternative is to let the action
            // decide if it should kill the propagation
            // and prevent default. AKA the action
            // could return true or false and we
            // would make these 2 calls accordingly.
            // for now we kill everything.

            e.preventDefault();
            e.stopImmediatePropagation();

            action();
        }
    },


});

exports.HotkeyController = HotkeyController;
});

