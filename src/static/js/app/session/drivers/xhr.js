define(function(require, exports, module) {

var $ = require('jquery');
var domain = require('app/settings/defaults').getSettings().getApiDomain();

function authenticate(username, password){
    var deferred = $.Deferred();

    $.get(domain + '/api/v1/token/me/?u='+username+'&p='+password)
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


