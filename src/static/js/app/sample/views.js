define(function(require, exports, module) {

var marionette = require('marionette');
var view = require('hbs!app/sample/templates/sample');

var SampleView = marionette.ItemView.extend({
    template: view
});

exports.SampleView = SampleView;

});