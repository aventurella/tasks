define(function (require, exports, module) {

var marionette = require('marionette');
var getElementId = require('built/core/utils/helpers').getElementId;
var registerElement = require('built/core/utils/helpers').registerElement;
var DragDropList = require('built/core/controls/dragdrop/list').DragDropList;
var dndevents = require('built/core/events/drag');


var DragAndDropCollectionView =  marionette.CollectionView.extend({
    initialize: function(options){
        options = _.extend({dataType:'com.built.generic'}, options);

        _.bindAll(this,
                'getDragImage',
                'getDragDataForElement',
                'renderPlaceholderForData',
                'dropResponderPerformDragOperation',
                'draggingEndedRestoreElementAtPosition'
                );
        this.dragDropList = new DragDropList({
            getDragImage: this.getDragImage,
            getDragDataForElement: this.getDragDataForElement,
            renderPlaceholderForData: this.renderPlaceholderForData,
            dropResponderPerformDragOperation: this.dropResponderPerformDragOperation,
            draggingEndedRestoreElementAtPosition: this.draggingEndedRestoreElementAtPosition,
            dataType:options.dataType
        });
        this.dragDropList.setDropElement(this.$el);
        this.on('show', this.onShow);

        this.listenTo(this.dragDropList, dndevents.DRAG_START, this._dragDidStart);
        this.listenTo(this.dragDropList, dndevents.DRAG_END, this._dragDidEnd);
    },

    onClose: function(){
        this.dragDropList.close();
    },

    onShow: function(){

    },

    _dragDidStart: function(){
        // forwarding events on
        this.trigger(dndevents.DRAG_START);
    },

    _dragDidEnd: function(){
        // forwarding events on
        this.trigger(dndevents.DRAG_END);
    },


    getViewForEl: function($el){
        return this.getViewForId(getElementId($el));
    },

    getDragImage: function(){
        return false;
    },

    renderPlaceholderForData: function(){
        throw 'renderPlaceholderForData Not Implemented';
    },

    getViewForId: function(id){
        var output;
        this.children.each(function(view){
            if(getElementId(view.$el) == id){
                output = view;
            }
        });
        return output;
    },

    getDragDataForElement: function($el){
        var view = this.getViewForEl($el);
        var model = view.model;
        this.collection.remove(model, {silent:true});
        return this.serializeModel(model);
    },

    serializeModel: function(model){
        return JSON.stringify(model.toJSON());
    },

    deserializeModel: function(data){
        return $.parseJSON(data);
    },

    dropResponderPerformDragOperation: function(responder, e){
        var model = this.deserializeModel(responder.getData());
        var position = this.dragDropList._placeholderIndex;
        this.dragDropList.removePlaceholder();
        this.collection.add(model, {at:position});
    },

    draggingEndedRestoreElementAtPosition: function(position, $el){
        var model = this.getViewForEl($el).model.toJSON();
        this.collection.add(model, {at:position});
    },

    appendHtml: function(collectionView, itemView, index){
        // insertDragElement will register the element for
        // BUILT and add it to the DragResponder.
        this.dragDropList.insertDragElement(index, itemView.$el);
    },

    removeChildView: function(view){
        // Will not be called on a drag removal
        // The drag removal operation calls
        // collection.remove() with the {silent:true} option.
        //
        // During dragging, this same logic is basically called
        // in dragDropList.dragResponderDraggingStarted. During a
        // dragging operation however, we don't know if the move will
        // actually happen until the user drops. Remember, this is not
        // called during a drag-drop operation, so if this is called
        // it means the user willfully removed a child, probably
        // using collection.remove. In any case the removal is
        // definitive, so we have to cleanup.

        var dragDropList = this.dragDropList;
        var manager = dragDropList.listManager;
        var list = manager.getArray();
        var index = list.indexOf(view.$el[0]);

        if(index == -1) return;

        var item = manager.removeObjectAt(index);

        dragDropList.dragResponder.removeElement(view.$el);

        // we need to do the cleanup before super(). Once super() runs,
        // the element will be destroyed.
        marionette.CollectionView.prototype.removeChildView.call(this, view);

    }

});

exports.DragAndDropCollectionView = DragAndDropCollectionView;

});

