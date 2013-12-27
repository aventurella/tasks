define(function(require, exports, module) {

var marionette = require('marionette');
var modals = require('built/app/modals');
var ClickTestResponder = require('built/core/responders/clicks').ClickTestResponder;
var KeyResponder = require('built/core/responders/keys').KeyResponder;
var keys = require('built/app/keys');
var events = require('../../events');
var status = require('../../models/task').status;
var EditTaskFormView = require('app/modals/views/edit-task').EditTaskFormView;


var TaskView = marionette.ItemView.extend({
    tagName: 'li',

    bindings:{
        '.lbl':'label',
        '.description':'description',
    },

    events:{
        'click .todo': 'wantsSetTodo',
        'click .edit': 'wantsEdit',
        'click .delete': 'wantsDelete',
        'click .in-progress': 'wantsSetInProgress',
        'click .completed': 'wantsSetCompleted',
        'click .archive': 'wantsSetArchived',
        'click .backlog': 'wantsSetBacklog',
        'click .actions':'wantsShowActions',
        'dblclick':'onDoubleClick'
    },

    ui: {
        'dropdownMenu':'.dropdown-menu'
    },

    initialize: function(){
        //_.bindAll(this, 'doCloseActions');
        // needed for when we reasign the assigned_to via server
        this.listenTo(this.model, 'change', this.render);

    },

    onClose: function(){
        if(this._clickTest){
            this._clickTest.close();
        }
        if(this.keyResponder){
            this.keyResponder.close();
            keys.removeFromResponderChain(this);
        }
    },

    onDoubleClick: function(){
        this.wantsEdit();
    },

    wantsShowActions: function(){

        if(!this.actionsMenuVisible){
            this.showActions();
        }
    },

    showActions: function(){
        this.actionsMenuVisible = true;

        var dropdownMenu = this.ui.dropdownMenu;
        dropdownMenu.show();

        var deferred = $.Deferred();

        var keyResponder = new KeyResponder({
            cancelOperation: deferred.resolve
        });

        var clickTest = new ClickTestResponder({
            el: this.$el,
            clickOutside: deferred.resolve
        });

        var responder = {
            keyDown: function(e){
                keyResponder.interpretKeyEvents(e);
                return true;
            }
        };

        keys.registerInResponderChain(responder);
        var self = this;

        deferred.then(function(){
            self.actionsMenuVisible = false;
            dropdownMenu.hide();
            clickTest.close();
            keyResponder.close();
            keys.removeFromResponderChain(responder);
        });
    },

    onRender: function(){
        this.stickit();
    },

    editTaskComplete: function(modalView){
        var data = modalView.getData();
        modals.dismissModal();
    },

    wantsSetTodo: function(){
        this.model.save('status', status.TODO);
    },

    wantsSetInProgress: function(){
        this.model.save('status', status.IN_PROGRESS);
    },

    wantsSetCompleted: function(){
        this.model.save('status', status.COMPLETED);
    },

    wantsSetArchived: function(){
        this.model.save('status', status.ARCHIVED);
    },

    wantsSetBacklog: function(){
        this.model.save('status', status.BACKLOG);
    },

    wantsEdit: function(){
        var taskForm = new EditTaskFormView({model: this.model});
        var modalView = modals.presentModal(taskForm);
        modalView.then(this.editTaskComplete);
    },

    wantsDelete: function(){
        this.model.destroy();
    },




});

exports.TaskView = TaskView;

});
