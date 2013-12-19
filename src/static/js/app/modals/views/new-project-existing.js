define(function(require, exports, module) {

var _ = require('underscore');
var marionette = require('marionette');
var events = require('../events');
var InputSelectScrollableComposite = require('built/ui/views/composite/input-select-scrollable').InputSelectScrollableComposite;
var Projects = require('app/sidebar/collections/projects').Projects;
var Project = require('app/sidebar/models/project').Project;
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
        input : 'input',
        headingText : '.heading div',
        results: '.results',
        action: '.action',
        inputField: '.input-field'
    },

    initialize: function(options){
        var self = this;
        this._data = {ok: false};
        this.collection = new Projects();
        this.model = new Project();

        this.collection.fetch({data:{all:1}}).then(function(){
            if(self.collection.length === 0 ){
                self.doShowForNone()
            }
            self.projects = self.collection.toArray();
        });
    },

    doShowForNone: function(){
        this.ui.headingText.html('You Are a part of all projects! Congrats! <br> (Go tell auby to make one!!!)');
        this.ui.results.hide();
        this.ui.action.hide();
        this.ui.inputField.hide();
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
        this.model.clear();
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
        if(_.isEqual(this.model.toJSON(),  view.model.toJSON())){
            this._data = {ok: true, model: this.model.toJSON()};
            // this needs to be here so that the server knows to save this user
            // to this project
            view.model.set('user', 'add')
            this.trigger(events.COMPLETE, this.getData());
            return
        }
        this.model.set(view.model.toJSON());
        this.ui.input.val(this.model.get('label'));
    },

    onClose: function(){
        this.cleanup();
    }

});

exports.NewProjectExistingView = NewProjectExistingView;

});


