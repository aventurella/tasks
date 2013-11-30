define(function(require, exports, module) {

var marionette = require('marionette');
var backbone = require('backbone');
var DragAndDropCompositeView = require('built/ui/views/composite/drag-and-drop').DragAndDropCompositeView;
var TaskView = require('./cells/task').TaskView;

var Swimlane = DragAndDropCompositeView.extend({
    itemView: TaskView,

    onShow: function(){
        this.collection = new backbone.Collection();
    },

    getDragImage: function(){
        return false;
    },

    renderPlaceholderForData: function(data){
        return $('<li class="task-placeholder"></li>');
    }

});

exports.Swimlane = Swimlane;

});


