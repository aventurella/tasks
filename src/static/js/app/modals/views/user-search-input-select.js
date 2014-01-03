define(function (require, exports, module) {

var marionette                      = require('marionette');

var InputSelectScrollableComposite  = require('built/ui/views/composite/input-select-scrollable').InputSelectScrollableComposite;
var data = require('built/core/events/data');

var ResultItem = require('./cells/user-search-cell').ResultItem;
var Assignees = require('../collections/assignees').Assignees;

var UserSearchInputSelect = InputSelectScrollableComposite.extend({
    itemView: ResultItem,
    itemViewContainer: '.list-group',

    ui : {
        input:'input'
    },

    events: {
        'keyup input': 'onInputKeypress'
    },

    initialize: function(){
        this.master = new Assignees();
        this.master.fetch();
        this.listenTo(this.master, 'sync', this.onMasterSync);
        this.collection = new Backbone.Collection();

        this.once('render', this.onShow);

    },

    onMasterSync: function(){
        // this.collection.reset(this.master.toJSON());
    },

    onInputKeypress: function(evt){
        // undo this and fix in component
        if(this.ui.input.val() === ''){
            this.collection.reset(this.master.toJSON());
        }
    },

    inputDidReceiveData: function(data){
        var search = this.ui.input.val();
        var filtered = this.master.filter(function(model){
            var email = model.get('email');
            if(email.indexOf(search) != -1){
                return true;
            }
        }, this);
        this.collection.reset(filtered);

    },

    presentCollectionView: function(){

    },

    dismissCollectionView: function(){

    },

    collectionViewDidCancel: function(){

        // YOU MUST CALL CLEANUP WHEN YOU ARE DONE
        // You may be animating the dismissal, or who knows
        // what, so we don't know when to call it, only you do.
        this.dismissCollectionView();
        this.cleanup();
    },

    collectionViewDidSelect: function(view){
        this.ui.input.val(view.model.get('path'));

        // YOU MUST CALL CLEANUP WHEN YOU ARE DONE
        // You may be animating the dismissal, or who knows
        // what, so we don't know when to call it, only you do.
        this.dismissCollectionView();
        this.cleanup();

        // At this point you should probably save a reference to
        // view.model somewhere, since this is what the user selected.
        // something like this.selectedModel = view.model
        // so you can do something with it later.
    },
});

exports.UserSearchInputSelect = UserSearchInputSelect;

});
