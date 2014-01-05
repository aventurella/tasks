define(function(require, exports, module) {

var _ = require('underscore');
var marionette = require('marionette');
var backbone = require('backbone');
var DragAndDropCollectionView = require('built/ui/views/collection/drag-and-drop').DragAndDropCollectionView;
var ScrollManager = require('built/core/managers/scroll').ScrollManager;
var tasks = require('../models/task');
var events = require('built/core/events/event');

var Task = require('../models/task').Task;
var status = require('../models/task').status;
var task_type = require('../models/task').task_type;

var Swimlane = DragAndDropCollectionView.extend({

    initialize: function(options){
        this.options = options;
        this.masterList = options.masterList;
        DragAndDropCollectionView.prototype.initialize.apply(this, arguments);

        this.listenTo(this.masterList, 'add', this.onTaskAdded);


        // all backlog items (up to 1000 are loaded)
        if(this.options.status > status.BACKLOG){
            this.initializeScrollManager();
        }
    },

    initializeScrollManager: function(){
        _.bindAll(this, 'wantsUpdateMaxScroll');

        var updateMaxScrollHandler = _.debounce(this.wantsUpdateMaxScroll, 300);
        var scrollManager = new ScrollManager({el: this.$el});

        scrollManager.addMarkerPositions(0.8);

        this.on('after:item:added', updateMaxScrollHandler);

        this.listenTo(scrollManager, events.MARKER, this.wantsLoadMoreTasks);
        this.scrollManager = scrollManager;
    },

    wantsUpdateMaxScroll: function(){
        this.scrollManager.calculateMaxScroll();
    },

    wantsLoadMoreTasks: function(sender, markers, direction){
        var last = this.collection.last();
        var scrollManager = this.scrollManager;

        // when the list grows, it effectively
        // scrolls us backwards, which means we will
        // receive a decremental direction after the marker's
        // incremental on the next scroll action.
        // we only want to pay attention to forward only actions.

        if(direction != 'incremental') return;

        this.masterList.tasksForStatus(
            this.options.status,
            last.get('id'))
        .then(function(r){
            if(r.objects.length === 0){
                scrollManager.close();
                scrollManager = null;
            }
        });
    },

    onTaskAdded: function(model){
        if(model.get('status') == this.options.status){
            this.collection.add(model);
        }
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

        if(this.options.status !== model.get('status')){
            model.set('status', this.options.status, {silent:true});
            model.save();
        }

        return model;
    },

    renderPlaceholderForData: function(data){
        return $('<li class="task-placeholder"></li>');
    },

    dropResponderPerformDragOperation: function(responder, e){
        var model = this.deserializeModel(responder.getData());
        DragAndDropCollectionView.prototype.dropResponderPerformDragOperation.apply(this, arguments);
    },

});

exports.Swimlane = Swimlane;

});


