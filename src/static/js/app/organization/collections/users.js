define(function( require, exports, module ){

var backbone = require('backbone');
var User = require('../models/user').User;
var domain = require('app/settings/defaults').getSettings().getApiDomain();

var Users =  backbone.Collection.extend({
    url:  domain + '/api/v1/organization/',
    model: User,
    parse: function(response){
        return response.objects;
    },
});

exports.Users = Users;

});
