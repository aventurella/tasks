define(function(require, exports, module) {

var $ = require('jquery');
var _ = require('underscore');
var marionette = require('marionette');
var backbone = require('backbone');
var events = require('../events');
var getSettings = require('app/settings/defaults').getSettings;
var template = require('hbs!../templates/account');


var AccountFormView = marionette.ItemView.extend({
    template: template,

    events: {
        'click .actions .btn.close': 'wantsClose',
    },

    ui: {
        username: '#inputUsername',
        password: '#inputPassword'
    },


    bindings: {
        '#inputUsername': 'username',
        '#inputPassword': 'password'
    },

    initialize: function(){
        this.model = getSettings().getAccount();
        this.listenTo(this.model, 'change', this.modelDidChange);
    },

    modelDidChange: function(e){
        console.log('Model Did Change');
        console.log(e);

        var settings = getSettings();
        settings.setAccount(this.model);
    },

    onRender: function(){
        this.stickit();
        this.ui.username.focus();
    },

    wantsClose: function(){
        this.trigger(events.COMPLETE);
    },

    getData: function(){
        return null;
    },

    onClose: function(){
    }

});

exports.AccountFormView = AccountFormView;

});


