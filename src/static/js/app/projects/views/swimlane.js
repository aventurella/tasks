define(function(require, exports, module) {

var marionette = require('marionette');
var backbone = require('backbone');
var DragAndDropCollectionView = require('built/ui/views/collection/drag-and-drop').DragAndDropCollectionView;
var tasks = require('../models/task');


var Task = require('../models/task').Task;
var task_type = require('../models/task').task_type;

var Swimlane = DragAndDropCollectionView.extend({

    initialize: function(options){
        this.masterList = options.masterList;
        DragAndDropCollectionView.prototype.initialize.apply(this, arguments);
    },

    getDragImage: function(){
        return false;
    },

    itemViewOptions: function(model, index) {
        if(model.get('task_type') == tasks.task_type.BUG){
            var ItemView = this.getItemView();

            return {
                className: ItemView.prototype.className + ' bug',
                swimlane: this
            };
        }
    },

    buildItemView: function(item, ItemView, itemViewOptions){
        var itemView = DragAndDropCollectionView
                       .prototype
                       .buildItemView
                       .call(this, item, ItemView, itemViewOptions);

        itemView.swimlane = this;
        return itemView;
    },

    deserializeModel: function(data){
        var model = $.parseJSON(data);
        model = this.masterList.get(model.id);
        model.set('status', this.options.status, {silent:true});
        return model;
    },

    renderPlaceholderForData: function(data){
        return $('<li class="task-placeholder"></li>');
    },

    dropResponderPerformDragOperation: function(responder, e){
        var model = this.deserializeModel(responder.getData());
        DragAndDropCollectionView.prototype.dropResponderPerformDragOperation.apply(this, arguments);
        var task = new tasks.Task(model);
        task.save();
    },

});

exports.Swimlane = Swimlane;

});


