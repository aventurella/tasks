define(function(require, exports, module) {


function getToken(){
    var token = localStorage.getItem('token');
    return token;
}

function setToken(value){
    localStorage.setItem('token', value);
}

exports.getToken = getToken;
exports.setToken = setToken;

});

