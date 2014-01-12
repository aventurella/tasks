define(function(require, exports, module) {

var marionette = require('marionette');

// This is handled by the cond! plugin.
// See vendor/require/cond/cond.js for where this generic name
// for both app/settings/driver and app/settings/urls
// is converted to a module name or data.
var driver = require('cond!app/settings/driver');
var urls = require('cond!app/settings/urls');
var settings = null;

var ApplicationSettings = marionette.Controller.extend({

    getApiDomain: function(){
        return urls.api;
    },

    getSocketDomain: function(){
        return urls.socket;
    },

    getToken: function(){
        return driver.getToken();
    },

    setToken: function(value){
        return driver.setToken(value);
    },

    setUser: function(user){
        return driver.setUser(user);
    },

    getUser: function(){
        return driver.getUser();
    },

    setCurrentProjectId: function(value){
        return driver.setCurrentProjectId(value);
    },

    getCurrentProjectId: function(){
        return driver.getCurrentProjectId();
    }
});

function getSettings(){
    if(!settings){
        settings = new ApplicationSettings();
    }

    return settings;
}

exports.getSettings = getSettings;

});

