define(function( require, exports, module ){

var backbone = require('backbone');
var Project = require('../models/project').Project;
var domain = require('app/settings/defaults').getSettings().getApiDomain();

var Projects =  backbone.Collection.extend({
    url: domain + '/api/v1/project/',
    model: Project,

    parse: function(response) {
        return response.objects;
    }
});

exports.Projects = Projects;

});
