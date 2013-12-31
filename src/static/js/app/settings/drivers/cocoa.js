define(function(require, exports, module) {

var UserModel = require('../models/user').UserModel;

var LSUserModel = UserModel.extend({
    initialize: function(){
        var userStr = localStorage.getItem('user');
        if(userStr){
            var user = JSON.parse(userStr);
            this.set(user);
        }
        this.on('all', this.saveLocal);
    },
    saveLocal: function(){
        localStorage.setItem('user', JSON.stringify(this.toJSON()));
    }
});


var _user = new LSUserModel();


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
    console.log('LSUserModel1', _user);
    return _user;
}

function setUser(user){
    console.log('LSUserModel2', user);
    _user.set(user);
}

exports.getToken = getToken;
exports.setToken = setToken;
exports.setCurrentProjectId = setCurrentProjectId;
exports.getCurrentProjectId = getCurrentProjectId;
exports.getUser = getUser;
exports.setUser = setUser;


});

