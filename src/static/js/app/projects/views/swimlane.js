define(function(require, exports, module) {

var marionette = require('marionette');
var backbone = require('backbone');
var DragAndDropCollectionView = require('built/ui/views/collection/drag-and-drop').DragAndDropCollectionView;
var TaskView = require('./cells/task').TaskView;

var Swimlane = DragAndDropCollectionView.extend({
    itemView: TaskView,

    getDragImage: function(){
        return false;
    },

    renderPlaceholderForData: function(data){
        return $('<li class="task-placeholder"></li>');
    }

});

exports.Swimlane = Swimlane;

});


