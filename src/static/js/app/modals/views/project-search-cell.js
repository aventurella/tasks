define(function(require, exports, module) {

var marionette = require('marionette');
var template = require('hbs!../templates/project-search-cell');


var ProjectSearchCell = marionette.ItemView.extend({
    template: template,
    tagName: 'li',
    className: 'project'

});

exports.ProjectSearchCell = ProjectSearchCell;

});


