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

