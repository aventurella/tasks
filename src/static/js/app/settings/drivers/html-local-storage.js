define(function(require, exports, module) {
var Account = require('../models/account').Account;

function getAccount(){
    var account = JSON.parse(localStorage.getItem('account'));
    return new Account(account);
}

function setAccount(account){
    localStorage.setItem('account', JSON.stringify(account.attributes));
}

exports.getAccount = getAccount;
exports.setAccount = setAccount;

});

