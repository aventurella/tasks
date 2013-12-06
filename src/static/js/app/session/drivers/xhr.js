define(function(require, exports, module) {

var $ = require('jquery');

function authenticate(username, password){
    var deferred = $.Deferred();

    $.get('http://localhost:8000/api/v1/project/?format=json', {
        username: username,
        password: password
    }).then(function(data){
        var token = 12345;
        deferred.resolve(token);
    });

    return deferred.promise();
}



exports.authenticate = authenticate;

});


