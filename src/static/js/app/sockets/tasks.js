define(function (require, exports, module) {

var marionette = require('marionette');

require('sockjs');

var TasksProtocol = marionette.Controller.extend({

   initialize : function(){

   },


});

exports.TasksProtocol = TasksProtocol;


});
