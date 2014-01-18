define(function (require, exports, module) {
    var _ = require('underscore');
    var marionette = require('marionette');

    _.extend(marionette.View.prototype, {
        contextMenus: function(){
            this.events['contextmenu'] = '_contextMenuOnRightClick';
        },

        _contextMenuOnRightClick: function(evt){
            var contextMenuOptions = _.result(this, 'contextMenuOptions');
            var completeHandler = contextMenuOptions.complete;

            if(!completeHandler && this.contextMenuComplete){
                completeHandler = _.bind(this.contextMenuComplete, this);
            } else {
                throw new Error(
                    '[ContextMenuError] You must define a ' +
                    '\'complete\' handler in contextMenuOptions ' +
                    'or provide the default \'contextMenuComplete\' '+
                    'method in this view');
            }

            var options = _.omit(contextMenuOptions, 'complete');
            var view = new this.contextMenu(options);

            this._contextMenuShow(view, evt.clientX, evt.clientY)
            .then(function(view){
                completeHandler(view);
                view.close();
            });


            evt.preventDefault();
            $(window).trigger(evt);
        },

        _contextMenuShow: function(view, x, y){
            var deferred = $.Deferred();

            view.render();
            view.once('complete', function(){
                deferred.resolve(view);
            });

            $('body').append(view.$el);

            view.$el.css({
                position:'fixed',
                left: x,
                top: y
            });

            return deferred.promise();
        },

    });


});
