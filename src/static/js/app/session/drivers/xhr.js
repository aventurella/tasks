define(function(require, exports, module) {

var $ = require('jquery');

function authenticate(username, password){
    var deferred = $.Deferred();

    $.get('http://54.242.250.233/api/v1/token/me/?u='+username+'&p='+password)
    .then(function(data){

        if(data.ok){
            deferred.resolve(data.token);
            return;
        }

        deferred.reject();
    });

    return deferred.promise();
}



exports.authenticate = authenticate;

});


