define(function(require, exports, module) {

var marionette = require('marionette');
var modals = require('built/app/modals');
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
        'click .action .btn.todo': 'wantsSetTodo',
        'click .action .btn.in-progress': 'wantsSetInProgress',
        'click .action .btn.completed': 'wantsSetCompleted',
        'click .action .btn.archive': 'wantsSetArchived',
        'click .action .btn.backlog': 'wantsSetBacklog',
        'dblclick':'onDoubleClick'
    },

    initialize: function(){

    },

    onDoubleClick: function(){
        var taskForm = new EditTaskFormView({model: this.model});
        var modalView = modals.presentModal(taskForm);
        modalView.then(this.editTaskComplete);
    },

    onRender: function(){
        this.stickit();
    },

    editTaskComplete: function(modalView){
        var data = modalView.getData();
        modals.dismissModal();
    },

    wantsSetTodo: function(){
        this.model.set('status', status.TODO);
    },

    wantsSetInProgress: function(){
        this.model.set('status', status.IN_PROGRESS);
    },

    wantsSetCompleted: function(){
        this.model.set('status', status.COMPLETED);
    },

    wantsSetArchived: function(){
        this.model.set('status', status.ARCHIVED);
    },

    wantsSetBacklog: function(){
        this.model.set('status', status.BACKLOG);
    },


});

exports.TaskView = TaskView;

});
