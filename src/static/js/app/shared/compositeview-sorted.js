define(function(require, exports, module) {

var marionette = require('marionette');

var CompositeViewSorted = marionette.CompositeView.extend({

    appendHtml: function(collectionView, itemView, index){
        var childrenContainer = collectionView.itemViewContainer ? collectionView.$(collectionView.itemViewContainer) : collectionView.$el;
        var children = childrenContainer.children();
        if (children.size() <= index) {
            childrenContainer.append(itemView.el);
        } else {
            children.eq(index).before(itemView.el);
        }
    }

});

exports.CompositeViewSorted = CompositeViewSorted;

});
