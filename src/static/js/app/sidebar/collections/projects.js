define(function( require, exports, module ){

var backbone = require('backbone');
var Project = require('../models/project').Project;

var Projects =  backbone.Collection.extend({
    url: 'http://54.242.250.233/api/v1/project/',
    model: Project,

    parse: function(response) {
        return response.objects;
    }
});

exports.Projects = Projects;

});
