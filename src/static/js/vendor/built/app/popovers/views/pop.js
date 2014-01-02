define(function(require, exports, module) {

var _ = require('underscore');
var marionette = require('marionette');
var dom = require('built/ui/helpers/dom');
var keys = require('built/app/keys');
var ClickTestResponder = require('built/core/responders/clicks').ClickTestResponder;

var PopView = marionette.View.extend({
    view: null,
    defaultEdge: 'bottom',

    initialize: function(options){
        this.view = options.view;
    },

    showRelativeToElement: function($el, edge){
        this._anchorElement = $el;

        var clientRect = dom.getElementBounds($el);

        var rect = {
            x: clientRect.left,
            y: clientRect.top,
            width: $el.prop('scrollWidth'),
            height: $el.prop('scrollHeight')};

        this.showRelativeToRect(rect, edge);
    },

    showRelativeToRect: function(rect, edge){
        // Warning, if you call this, you will be
        // responsible for repositioning the the view
        // if something related in your viewport changes.
        // Chances are you wanted showRelativeToElement instead
        // of calling this directly.
        edge = edge || this.defaultEdge;

        this._anchorRect = rect;
        this._anchorEdge = edge;

        this.render();
        // don't show anything until after layout has happened
        this.$el.css({
            position: 'absolute',
            visibility: 'hidden'
        });

        // we need this in the DOM first so we can
        // get some measurements. This is primiarily
        // for an anchor edge of 'top'
        if(this._anchorElement){
            this._anchorElement.append(this.el);

            if(this._anchorElement.prop('style').position != 'relative'){
                this._anchorElement.css({position: 'relative'});
            }
        } else {
            $('body').prepend(this.el);
        }

        this.triggerMethod('show');

        this.layout();
        this.$el.css({visibility: 'visible'});
    },

    layout: function(){
        var viewBounds = dom.getElementBounds(this.view.$el);

        // the view.$el could have an absolutely positioned
        // element, etc inside of it. getElementBounds would
        // report the improper dimensions, so we make the corrective
        // adjustement using scrollWidth and scrollHeight of
        // view.$el's parent container aka this.$el
        var viewRect = {
            x: viewBounds.left,
            y: viewBounds.top,
            width: this.$el.prop('scrollWidth'),
            height: this.$el.prop('scrollHeight')
        };

        var css = {};

        if(_.isFunction(this._anchorEdge)){

            this._anchorEdge(
                this._anchorRect,
                this._anchorElement,
                viewRect,
                css);

        } else {

            this.defaultLayout(
                this._anchorEdge,
                this._anchorRect,
                this._anchorElement,
                viewRect,
                css);
        }

        this.$el.css(css);
    },

    defaultLayout: function(anchorEdge, anchorRect, $anchorElement, viewRect, css){
        switch(anchorEdge){
            case 'bottom':
                this.anchorBottom(anchorRect, $anchorElement, viewRect, css);
                break;

            case 'top':
                this.anchorTop(anchorRect, $anchorElement, viewRect, css);
                break;

            case 'left':
                this.anchorLeft(anchorRect, $anchorElement, viewRect, css);
                break;

            case 'right':
                this.anchorRight(anchorRect, $anchorElement, viewRect, css);
                break;
        }
    },

    anchorBottom: function(anchorRect, $anchorElement, viewRect, css){
        css.top = anchorRect.y + anchorRect.height;
        css.left = anchorRect.x;
    },

    anchorRight: function(anchorRect, $anchorElement, viewRect, css){
        css.top = anchorRect.y;
        css.left = anchorRect.x + anchorRect.width;
    },

    anchorLeft: function(anchorRect, $anchorElement, viewRect, css){
        css.top = anchorRect.y;
        css.left = anchorRect.x;
    },

    anchorTop: function(anchorRect, $anchorElement, viewRect, css){
        css.top = anchorRect.y;
        css.left = anchorRect.x;
    },

    render: function(){

        this.view.render();
        this.$el.empty().append(this.view.el);
    },

    performKeyEquivalent: function(e){
        return false;
    },

    keyDown: function (e){
        if (e.keyCode == 27){ // ESCAPE
            this.triggerMethod('close');
        }

        // no matter what we stop the key event
        // propagation here.
        return true;
    },

    wantsDismissFromClick: function(){
        this.triggerMethod('close');
    },

    onShow: function(){

        this.view.triggerMethod('show');

        keys.registerInResponderChain(this);
        keys.registerInResponderChain(this.view);

        this._clicks = new ClickTestResponder({
            el: this.view.$el,
            clickOutside: _.bind(this.wantsDismissFromClick, this)
        });
    },

    onClose: function(){
        this.view.triggerMethod('close');

        keys.removeFromResponderChain(this.view);
        keys.removeFromResponderChain(this);
        this._clicks.close();

        this.$el.remove();
    }
});

exports.PopView = PopView;

});


