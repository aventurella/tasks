define(function(require, exports, module) {

var _ = require('underscore');
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
    debounceDelay: 0,
    minLength: 0,

    events: {
        'click .btn.attach': 'wantsComplete',
        'click .btn.cancel': 'wantsCancel'

    },

    ui: {
        input : 'input'
    },

    initialize: function(options){
        var self = this;
        this._data = {ok: false};
        this.collection = new Projects();

        this.collection.fetch({data:{all:1}}).then(function(){
            self.projects = self.collection.toArray();
        });
    },

    wantsComplete: function(){
        this._data = {ok: true, model: this.model};
        this.trigger(events.COMPLETE, this.getData());

    },

     wantsCancel: function(){
        this._data = {ok: false};
        this.trigger(events.COMPLETE, this.getData());
    },

    getData: function(){
        return this._data;
    },

    inputDidReceiveData: function(data){
        if(data.length === 0){
            this.collection.reset(this.projects);
            return;
        }

        var regex = new RegExp(data, 'i');

        var filter = _.filter(this.projects, function(model){
            var label = model.get('label').toLowerCase();
            data = data.toLowerCase();
            var test = regex.test(label);
            return test;
        });

        this.collection.reset(filter);
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


