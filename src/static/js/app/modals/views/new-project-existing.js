define(function(require, exports, module) {

var marionette = require('marionette');
var events = require('../events');
var InputSelectScrollableComposite = require('built/ui/views/composite/input-select-scrollable').InputSelectScrollableComposite;
var Projects = require('app/sidebar/collections/projects').Projects;
var ProjectSearchCell = require('./project-search-cell').ProjectSearchCell;
var template = require('hbs!../templates/new-project-existing');

var NewProjectExistingView = InputSelectScrollableComposite.extend({
    template: template,
    itemView: ProjectSearchCell,
    itemViewContainer: '.results',

    events: {
        'click .btn.attach': 'wantsComplete'
    },

    triggers: {
        'click .btn.cancel': events.COMPLETE
    },

    ui: {
        input : 'input'
    },

    initialize: function(){
        this._data = {ok: false};
        this.collection = new Projects();
        this.collection.fetch();
    },

    wantsComplete: function(){
        this._data = {ok: true, model: this.model};
        this.trigger(events.COMPLETE, this.getData());
    },

    getData: function(){
        return this._data;
    },

    inputDidReceiveData: function(data){
        console.log(data);
        console.log(this.collection)
        //this.collection.search(data);
    },

    presentCollectionView: function(){
    },

    dismissCollectionView: function(){
    },

    collectionViewDidCancel: function(){
    },

    collectionViewDidSelect: function(view){
        this._data = {ok: true, model: view.model};
    },

    onClose: function(){
        this.cleanup();
    }

});

exports.NewProjectExistingView = NewProjectExistingView;

});


