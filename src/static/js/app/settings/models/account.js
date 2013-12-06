define(function(require, exports, module) {

var marionette = require('marionette');
var backbone = require('backbone');


var Account = backbone.Model.extend({
    defaults: {
        username: null,
        password: null
    }
});


exports.Account = Account;

});

