define(function (require, exports, module) {
    var _ = require('underscore');
    var marionette = require('marionette');

    _.extend(marionette.View.prototype, {
        contextMenus: function(){
            this.events['contextmenu'] = '_onRightClick';
            this._deferred = new $.Deferred();
            return this._deferred;
        },
        _onRightClick: function(evt){
            var contextMenuOptions = this._getContextMenuOptions();
            this._contextView = new this.contextMenu(contextMenuOptions);
            this._contextView.render();
            this.listenTo(this._contextView, 'select', this._onContextSelect);
            $('body').append(this._contextView.$el);
            this._contextView.$el.css({
                position:'fixed',
                top:evt.clientY,
                left:evt.clientX
            });

            $(window).trigger(evt);
            return false;
        },
        _onContextSelect: function(event){
            this._contextView.close();
            this._deferred.resolve(event);
        },
        _getContextMenuOptions: function(){
            var isFunction = _.isFunction(this.contextMenuOptions);
            if(!this.contextMenuOptions){
                return {};
            }else if(isFunction){
                return this.contextMenuOptions();
            }else{
                return this.contextMenuOptions;
            }
        },
    });


});
