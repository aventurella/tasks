define(function(require, exports, module){

var marionette = require('marionette');
var renderer = require('app/renderer');
var main = require('app/main');
var vent = require('app/vent').vent;

var app = new marionette.Application({vent: vent});
app.addInitializer(main.main);
app.start();

}); // eof define
