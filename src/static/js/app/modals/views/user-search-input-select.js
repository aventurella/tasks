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
        selectedUser:'.selected-user',
        listGroup:'.list-group',
        clearSelectedUser: '.clear-selected-user'
    },

    events: {
        'keyup input': 'onKeyup',
        'click .selected-user': 'wantsToSelectUser',
        'blur input':'wantsToBlurInput',
        'click .clear-selected-user':'wantsToClearUser'
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
        this.ui.input.hide();
        if(!this.model.get('assigned_to')){
            this.ui.clearSelectedUser.hide();
        }
    },

    wantsToSelectUser: function(){
        this.ui.input.show();
        this.ui.input.focus();
        this.ui.selectedUser.hide();
        return false;
    },

    wantsToBlurInput: function(){
        this.ui.input.hide();
        this.ui.selectedUser.show();
    },

    wantsToClearUser: function(){
        this.clearSelectedUser();
        return false;
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
        this.ui.input.val('');
        this.ui.input.blur();
        this.dismissCollectionView();
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
        // this.presentCollectionView();
    },

    presentCollectionView: function(){
        this.ui.listGroup.show();
    },

    dismissCollectionView: function(){
        this.ui.listGroup.hide();

    },

    collectionViewDidCancel: function(){
        this.dismissCollectionView();
        this.cleanup();
    },

    collectionViewDidSelect: function(view){
        this.model.set('assigned_to', view.model.get('resource_uri'));
        this.ui.selectedUser.html(view.model.get('email'));
        this.resetCollection();
        this.ui.input.hide();
        this.ui.selectedUser.show();
        this.ui.clearSelectedUser.show();
    },

    clearSelectedUser: function(){
        this.model.set('assigned_to', null);
        this.ui.selectedUser.html('no one');
        this.ui.clearSelectedUser.hide();
    },
});

exports.UserSearchInputSelect = UserSearchInputSelect;

});
