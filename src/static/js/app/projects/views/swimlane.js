define(function(require, exports, module) {

var marionette = require('marionette');
var backbone = require('backbone');
var DragAndDropCollectionView = require('built/ui/views/collection/drag-and-drop').DragAndDropCollectionView;
var Task = require('../models/task').Task;

var Swimlane = DragAndDropCollectionView.extend({

    initialize: function(){
        DragAndDropCollectionView.prototype.initialize.apply(this, arguments);
    },

    getDragImage: function(){
        return false;
    },

    deserializeModel: function(data){
        var model = $.parseJSON(data);
        model.status = this.options.status;
        return model;
    },

    renderPlaceholderForData: function(data){
        return $('<li class="task-placeholder"></li>');
    },

    dropResponderPerformDragOperation: function(responder, e){
        var model = this.deserializeModel(responder.getData());
        DragAndDropCollectionView.prototype.dropResponderPerformDragOperation.apply(this, arguments);
        var task = new Task(model);
        task.save();
    },

});

exports.Swimlane = Swimlane;

});


