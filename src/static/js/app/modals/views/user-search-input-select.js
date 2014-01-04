define(function (require, exports, module) {

var marionette                      = require('marionette');

var InputSelectScrollableComposite  = require('built/ui/views/composite/input-select-scrollable').InputSelectScrollableComposite;
var data = require('built/core/events/data');

var ResultItem = require('./cells/user-search-cell').ResultItem;
var Assignees = require('../collections/assignees').Assignees;

var UserSearchInputSelect = InputSelectScrollableComposite.extend({
    itemView: ResultItem,
    itemViewContainer: '.list-group',
    minLength: 0,
    debounceDelay: 0,

    ui : {
        input:'input',
        selectedUser:'.selected-user'
    },

    events: {
        'keyup input': 'onKeyup'
    },

    initialize: function(){
        this.master = new Assignees();
        this.master.fetch();
        this.listenTo(this.master, 'sync', this.resetCollection);
        this.collection = new Backbone.Collection();
        this.once('render', this.onShow);
    },

    onShow: function(){
        InputSelectScrollableComposite.prototype.onShow.apply(this, arguments);
    },

    onKeyup: function(){
        var search = this.ui.input.val();
        if(this._search !== '' && search === ''){
            this.resetCollection();
            return;
        }
    },

    resetCollection: function(){
        this.collection.reset(this.master.toJSON());
        this._search = '';
    },

    inputDidReceiveData: function(data){
        var search = this.ui.input.val();
        if(search == this._search)return;
        var filtered = this.master.filter(function(model){
            var email = model.get('email');
            if(email.indexOf(search) != -1){
                return true;
            }
        }, this);
        this.collection.reset(filtered);
        this._search = search;
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
        this.model.set('assigned_to', view.model.get('resource_uri'));
        this.ui.selectedUser.html(view.model.get('email'));

    },
});

exports.UserSearchInputSelect = UserSearchInputSelect;

});
