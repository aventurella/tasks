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
    var token = localStorage.getItem('token');
    return token;
}

function setToken(value){
    localStorage.setItem('token', value);
}

function getUser(){
    // console.log('LSUserModel1', _user.toJSON());
    return _user;
}

function setUser(user){
    // console.log('LSUserModel2', user);
    _user.set(user);
}

exports.getToken = getToken;
exports.setToken = setToken;
exports.getUser = getUser;
exports.setUser = setUser;

});

