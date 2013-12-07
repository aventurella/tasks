define(function(require, exports, module) {

var marionette = require('marionette');
var Project = require('app/sidebar/models/project').Project;
var events = require('../events');
var template = require('hbs!../templates/new-project-create');


var NewProjectCreateView = marionette.ItemView.extend({
    template: template,

    triggers: {
        'click .btn.create': events.COMPLETE
    },

    ui: {
        input : 'input'
    },

    bindings: {
        'input': 'label'
    },

    onShow: function(){
        this.model = new Project();
        this.ui.input.focus();
        this.stickit();
    },

    getData: function(){
        return {ok: true, model: this.model};
    },
});

exports.NewProjectCreateView = NewProjectCreateView;

});


