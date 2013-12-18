define(function(require, exports, module) {

var marionette = require('marionette');
var events = require('../../events');
var template = require('hbs!app/projects/templates/cell-archived');

var CellArchivedView = marionette.ItemView.extend({
    template: template,
    className: 'task archived',
    tagName: 'li',


    onShow: function(){
    },


});

exports.CellArchivedView = CellArchivedView;

});
