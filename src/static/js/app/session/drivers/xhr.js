define(function(require, exports, module) {

var $ = require('jquery');

function authenticate(username, password){
    var deferred = $.Deferred();

    $.get('http://localhost:8000/api/v1/token/'+username+'/'+password+'/' )
    .then(function(data){

        data.ok = true;
        data.token = 'af7b4c1a';

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


