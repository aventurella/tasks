define(function(require, exports, module) {

var $ = require('jquery');
var domain = require('app/settings/defaults').getSettings().getApiDomain();

function authenticate(username, password){
    var deferred = $.Deferred();

    var query = {u: username, p: password};
    var url = domain + '/api/v1/token/me/';
    var options = {
        url: url,
        data: query,
        dataType: 'json'
    };

    $.ajax(options)
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


