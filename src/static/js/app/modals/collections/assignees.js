define(function( require, exports, module ){

var backbone = require('backbone');
var Assignee = require('../models/assignee').Assignee;
var domain = require('app/settings/defaults').getSettings().getApiDomain();

var Assignees =  backbone.Collection.extend({
    url: domain+'/api/v1/assignee/',
    model: Assignee,
    parse: function(resposne){
        return resposne.objects;
    },
});

exports.Assignees = Assignees;

});
