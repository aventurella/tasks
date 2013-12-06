define(function(require, exports, module) {

var marionette = require('marionette');
var backbone = require('backbone');
var DragAndDropCollectionView = require('built/ui/views/collection/drag-and-drop').DragAndDropCollectionView;
var TaskView = require('./cells/task').TaskView;

var Swimlane = DragAndDropCollectionView.extend({
    itemView: TaskView,

    initialize: function(){
        DragAndDropCollectionView.prototype.initialize.apply(this, arguments);
        this.listenTo(this.collection, 'add', this.onCollectionAdd)
    },

    getDragImage: function(){
        return false;
    },

    itemViewOptions: function(model, index) {

        return {
            className: model.get('type')
        };
    },

    deserializeModel: function(data){
        var model = $.parseJSON(data);
        model.status = this.options.status;
        return model;
    },

    renderPlaceholderForData: function(data){
        return $('<li class="task-placeholder"></li>');
    },

    onCollectionAdd: function(model){
        model.save();
    },

});

exports.Swimlane = Swimlane;

});


