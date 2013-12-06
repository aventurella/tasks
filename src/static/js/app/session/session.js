define(function(require, exports, module) {


var _ = require('underscore');
var marionette = require('marionette');


// see common.js -> maps for this defination
var driver = require('driver');
var session = null;

var ApplicationSession = marionette.Controller.extend({

    initialize: function(options){
        this._token = options.token;
    },

    getToken: function(){
        return this._token;
    }
});

function startSession(account){
    var data = account.attributes;
    var deferred = $.Deferred();

    driver.authenticate(data.username, data.password)
          .then(function(token){
            session = new ApplicationSession({token: token});
            deferred.resolve(session);
          });

    return deferred.promise();
}

function getSession(){
    return session;
}

exports.getSession = getSession;
exports.startSession = startSession;

});


