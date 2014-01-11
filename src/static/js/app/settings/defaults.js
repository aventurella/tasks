define(function(require, exports, module) {

var marionette = require('marionette');

// see common.js -> maps for this defination
var driver = require('driver');
var settings = null;

var ApplicationSettings = marionette.Controller.extend({

    getApiDomain: function(){
        //return 'http://54.242.250.233';
        return 'http://localhost:8000';
    },

    getSocketDomain: function(){
        //return 'http://54.242.250.233:8888';
        return 'http://localhost:8888';
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

