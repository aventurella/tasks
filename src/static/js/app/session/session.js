define(function(require, exports, module) {


var $ = require('jquery');

// see common.js -> maps for this defination
var driver = require('driver');
var session = null;


function startSession(account){
    var data = account.attributes;
    var deferred = $.Deferred();

    var success = function(token){
        deferred.resolve(token);
    };

    var fail = function(){
        deferred.reject();
    };

    driver.authenticate(data.username, data.password)
          .then(success, fail);

    return deferred.promise();
}

exports.startSession = startSession;

});


