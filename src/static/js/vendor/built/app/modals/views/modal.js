define(function(require, exports, module) {

var marionette = require('marionette');
var events = require('../events');

// This requires that built/app/patches/render
// has been applied as there is no template

require('built/app/patches/render');


var ModalView = marionette.ItemView.extend({
    className: 'view',
    itemView: null,

    initialize: function(options){
        this.view = options.itemView;
    },

    onShow: function(){
        this.view.setElement(this.$el, true);
        this.view.render();
        this.view.once(events.COMPLETE, this.modalComplete, this);
    },

    modalComplete: function(){
        this._data = this.view.getData();
        this.trigger(events.COMPLETE, this);
    },

    getData: function(){
        return this._data;
    },

    onClose: function(){
        this.view.close();
    }
});

exports.ModalView = ModalView;

});


