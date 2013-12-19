define(function (require, exports, module) {

var _ = require('underscore');
var marionette = require('marionette');
var getElement = require('built/ui/helpers/dom').getElement;
var focus = require('built/core/events/focus');
var helpers = require('built/core/utils/helpers');
var SingleFocusManager = require('built/core/managers/focus-single').SingleFocusManager;

var CssSingleFocusManager = marionette.Controller.extend({

    focusClass: 'focus',

    initialize: function(options){

        this.map = {};
        this.focusClass = options.focusClass || this.focusClass;

        this.focusManager = new SingleFocusManager({
            allowsDeselect: options.allowsDeselect || SingleFocusManager.prototype.allowsDeselect
        });

        this.listenTo(this.focusManager, focus.FOCUS, this.itemViewWantsFocus);
        this.listenTo(this.focusManager, focus.BLUR, this.itemViewWantsBlur);
    },


    itemViewWantsFocus: function(sender, domNode){
        var $el = $(domNode);
        var target = this.map[helpers.getElementId($el)];

        if(this.focusClass){
            $el.addClass(this.focusClass);
        }

        if(target.triggerMethod){
            target.triggerMethod('focus');
        }
    },

    itemViewWantsBlur: function(sender, domNode){
        var $el = $(domNode);
        var target = this.map[helpers.getElementId($el)];


        if(this.focusClass){
            $el.removeClass(this.focusClass);
        }

        if(target.triggerMethod){
            target.triggerMethod('blur');
        }
    },

    blur: function(obj){

        if(!obj){
            // this will be the actual DOM element
            // not wrapped in anything.
            obj = this.focusManager.getFocusedObject();
            this.focusManager.blur(obj);
            return;
        }

        var $el = obj.$el || obj;
        this.focusManager.blur($el[0]);
    },

    focus: function(obj){
        var $el = obj.$el || obj;
        this.focusManager.focus($el[0]);
    },

    setArray: function(itemViews){
        // this needs to be an array of ItemView *like* objects
        // used the designated initializers to get there.
        this.map = {};

        var getElementId = helpers.getElementId;
        var registerElement = helpers.registerElement;

        var items = _.map(itemViews, function(item){

            registerElement(item.$el);
            this.map[getElementId(item.$el)] = item;

            return item.$el[0];

        }, this);

        this.focusManager.setArray(items);
    },

    insertObject: function(itemView){
        helpers.registerElement(itemView.$el);
        this.map[helpers.getElementId(itemView.$el)] = itemView;
        this.focusManager.insertObject(itemView.$el[0]);
    }

});

function _ElementWrapper($el){
    this.$el = $el;
}

function focusManagerWithSelector(selector, options){
    // if a user passes a selector or the result of a
    // selector: $('.foo') we need to wrap them to be
    // ItemView *like*
    var targets = getElement(selector);

    var array = _.map(targets, function($el){
        helpers.registerElement($el);
        return new _ElementWrapper($el);
    });

    return focusManagerWithArray(array, options);
}

function focusManagerWithElements(elements, options){
    // if a user passes [$el, $el, $el]
    // we need to wrap them to be ItemView *like*
    var array = _.map(elements, function($el){
        return new _ElementWrapper($el);
    });

    return focusManagerWithArray(array, options);
}

function focusManagerWithArray(array, options){
    // only *ItemView* like objects should be in the passed
    // array. If you need to send in elements see:
    //
    // focusManagerWithElements
    // OR
    // focusManagerWithSelector

    var focusManager = new CssSingleFocusManager(options || {});
    focusManager.setArray(array);
    return focusManager;
}

function focusManagerWithCollectionView(collectionView, options){
    var focusManager = new CssSingleFocusManager(options || {});

    var collectionViewDidAddItem = function(itemView){
        focusManager.insertObject(itemView);
    };

    var collectionViewDidRemoveItem = function(itemView){
        var array = focusManager.focusManager.getArray();
        var index = array.indexOf(itemView.$el[0]);

        if(index > -1){
            focusManager.focusManager.removeObjectAt(index);
        }
    };

    focusManager.on('after:item:added', collectionViewDidAddItem);
    focusManager.on('item:removed', collectionViewDidRemoveItem);

    return focusManager;
}

exports.focusManagerWithSelector = focusManagerWithSelector;
exports.focusManagerWithElements = focusManagerWithElements;
exports.focusManagerWithArray = focusManagerWithArray;
exports.focusManagerWithCollectionView = focusManagerWithCollectionView;
exports.CssSingleFocusManager = CssSingleFocusManager;

});





