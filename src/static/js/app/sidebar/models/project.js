define(function( require, exports, module ){

var backbone = require('backbone');
var url = require('app/shared/model-utils').url;

var Project = backbone.Model.extend({
    url: url,
    defaults: {
        label: null
    }
});

exports.Project = Project;

});
