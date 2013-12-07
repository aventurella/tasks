define(function(require, exports, module) {

var marionette = require('marionette');
var template = require('hbs!../templates/new-project-existing');


var NewProjectExistingView = marionette.ItemView.extend({
    template: template,

    ui: {
        input : 'input'
    },

    onShow: function(){

    },

    getData: function(){
        return {ok: true, model: this.model};
    },

});

exports.NewProjectExistingView = NewProjectExistingView;

});


