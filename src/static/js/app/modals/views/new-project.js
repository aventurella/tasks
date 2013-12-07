define(function(require, exports, module) {

var marionette = require('marionette');
var NewProjectCreateView = require('./new-project-create').NewProjectCreateView;
var NewProjectExistingView = require('./new-project-existing').NewProjectExistingView;
var modalEvents = require('../events');
var template = require('hbs!../templates/new-project');


var NewProjectView = marionette.Layout.extend({
    template: template,

    regions: {
        create: '#new-project-create',
        existing: '#new-project-existing'
  },

  onRender: function(){
    this.createView = new NewProjectCreateView();
    this.existingView = new NewProjectExistingView();

    this.create.show(this.createView);
    this.existing.show(this.existingView);

    this.listenTo(this.createView, modalEvents.COMPLETE, this.wantsComplete);
    this.listenTo( this.existingView, modalEvents.COMPLETE, this.wantsComplete);
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


