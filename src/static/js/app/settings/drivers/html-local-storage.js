define(function(require, exports, module) {

var SettingsUser = require('../models/user').SettingsUser;

function getToken(){
    var token = localStorage.getItem('token');
    return token;
}

function setToken(value){
    localStorage.setItem('token', value);
}

function setCurrentProjectId(value){
   localStorage.setItem('currentProjectId', value);
}

function getCurrentProjectId(){
   var id = localStorage.getItem('currentProjectId');
   return id;
}

function getUser(){
    var data = JSON.parse(localStorage.getItem('user'));
    return new SettingsUser(data);
}

function setUser(user){
    localStorage.setItem('user', JSON.stringify(user.toJSON()));
}

exports.getToken = getToken;
exports.setToken = setToken;
exports.setCurrentProjectId = setCurrentProjectId;
exports.getCurrentProjectId = getCurrentProjectId;
exports.getUser = getUser;
exports.setUser = setUser;

});

