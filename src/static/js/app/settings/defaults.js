define(function(require, exports, module) {

var marionette = require('marionette');

// see common.js -> maps for this defination
var driver = require('driver');
var settings = null;


var ApplicationSettings = marionette.Controller.extend({

    getToken: function(){
        return driver.getToken();
    },

    setToken: function(value){
        return driver.setToken(value);
    },

    setUser: function(data){
        console.log(data)
        if(data.ok){
            this._user = user;
        }else{
            driver.setToken('')
        }
        return data.ok
    },

    getUser: function(){
        return this._user;
    },
});

function getSettings(){
    if(!settings){
        settings = new ApplicationSettings();
    }

    return settings;
}

exports.getSettings = getSettings;

});

