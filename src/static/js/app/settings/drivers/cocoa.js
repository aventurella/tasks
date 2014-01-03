define(function(require, exports, module) {

var SettingsUser = require('../models/user').SettingsUser;


function getToken(){
    return Bridge.settings.token;
}

function setToken(value){
    Bridge.settings.token = value;
}

function setCurrentProjectId(value){
    Bridge.settings.currentProjectId = value;
}

function getCurrentProjectId(){
    //$('#window').prepend('<pre>' + getCurrentProjectId+ '</pre>')
    return Bridge.settings.currentProjectId;
}

function getUser(){
    var data = Bridge.settings.user;

    var user = new SettingsUser({
        first_name: data.first_name,
        last_name: data.last_name,
        organization: data.organization,
        organization_id: data.organization_id});

    return user;
}

function setUser(user){
    //$('#window').prepend('<pre>' + new TSKSettingsUser() + '</pre>');
    obj = TSKSettingsUser.userWithDict(user.toJSON());
    Bridge.settings.user = obj;
}

exports.getToken = getToken;
exports.setToken = setToken;
exports.setCurrentProjectId = setCurrentProjectId;
exports.getCurrentProjectId = getCurrentProjectId;
exports.getUser = getUser;
exports.setUser = setUser;


});

