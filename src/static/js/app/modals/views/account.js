define(function(require, exports, module) {

var $ = require('jquery');
var _ = require('underscore');
var marionette = require('marionette');
var backbone = require('backbone');
var events = require('../events');
var getSettings = require('app/settings/defaults').getSettings;
var template = require('hbs!../templates/account');
var Account = require('app/settings/models/account').Account;

var AccountFormView = marionette.ItemView.extend({
    template: template,

    events: {
        'click .action .btn.login': 'wantsClose',
        'keypress #inputUsername':'checkForEnter',
        'keypress #inputPassword':'checkForEnter'
    },

    ui: {
        username: '#inputUsername',
        password: '#inputPassword'
    },


    bindings: {
        '#inputUsername': 'username',
        '#inputPassword': 'password'
    },

    initialize: function(options){
        options = options || {};
        this.model = options.account || new Account();
    },

    onRender: function(){
        this.stickit();
        this.ui.username.focus();
    },

    wantsClose: function(){
        this.trigger(events.COMPLETE);
    },

    getData: function(){
        return {ok: true, model: this.model};
    },

    checkForEnter: function(e){
        if(e.keyCode == 13){
            this.wantsClose();
        }
    },

    onClose: function(){
    }

});

exports.AccountFormView = AccountFormView;

});


