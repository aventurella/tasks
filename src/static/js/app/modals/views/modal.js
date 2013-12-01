define(function(require, exports, module) {

var marionette = require('marionette');
var view = require('hbs!../templates/modal');

var ModalView = marionette.ItemView.extend({
    template: view,
    className: 'view',
    itemView: null,

    initialize: function(options){
        this.view = options.itemView;
    },

    onShow: function(){
        this.view.setElement(this.$el, true);
        this.view.render();
        this.$el.show();

        this.view.once('application:modal:complete', this.modalComplete, this);
    },

    modalComplete: function(){
        this._data = this.view.getData();
        this.trigger('complete', this);
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


