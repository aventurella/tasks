define(function(require, exports, module) {

var marionette = require('marionette');

// see common.js -> maps for this defination
var driver = require('driver');
var settings = null;


var ApplicationSettings = marionette.Controller.extend({

    getAccount: function(){
        return driver.getAccount();
    },

    setAccount: function(account){
        driver.setAccount(account);
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

