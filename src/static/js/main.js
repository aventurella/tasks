var Bridge = window.Bridge || undefined;

define(function(require, exports, module){

var marionette = require('marionette');
var renderer = require('app/renderer');
var main = require('app/main');

//require('./mock/init');

var app = new marionette.Application();
app.addInitializer(main.main);
app.start();

}); // eof define
