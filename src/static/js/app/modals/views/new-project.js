define(function(require, exports, module) {

var marionette = require('marionette');
var NewProjectCreateView = require('./new-project-create').NewProjectCreateView;
var NewProjectExistingView = require('./new-project-existing').NewProjectExistingView;
var modalEvents = require('../events');
var template = require('hbs!../templates/new-project');
var KeyResponder = require('built/core/responders/keys').KeyResponder;

var NewProjectView = marionette.Layout.extend({
    template: template,
    id: 'testing',
    regions: {
        create: '#new-project-create',
        existing: '#new-project-existing'
  },

  onRender: function(){
    _.bindAll(this, 'wantsCancelWithKeys')
    this.createView = new NewProjectCreateView();
    this.existingView = new NewProjectExistingView();

    this.create.show(this.createView);
    this.existing.show(this.existingView);

    this.listenTo(this.createView, modalEvents.COMPLETE, this.wantsComplete);
    this.listenTo( this.existingView, modalEvents.COMPLETE, this.wantsComplete);
    this.keyResponder = new KeyResponder({
            el: $(window),
            cancelOperation: this.wantsCancelWithKeys
        });
  },

  onClose: function(){
      this.keyResponder.close();
  },

  wantsCancelWithKeys: function(){
      this.trigger(modalEvents.COMPLETE);
  },

  wantsComplete: function(obj){
    this._data = obj;
    this.trigger(modalEvents.COMPLETE);
  },

  getData: function(){
    return this._data;
  },


});

exports.NewProjectView = NewProjectView;

});


