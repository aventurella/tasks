define(function (require, exports, module) {

var marionette = require('marionette');
var getSettings = require('app/settings/defaults').getSettings;
require('sockjs');

var SockController = marionette.Controller.extend({

   initialize : function(){
        _.bindAll(this, 'onopen', 'onmessage', 'onclose');
        this.sock = new SockJS('http://127.0.0.1:8888');
        this.sock.onopen = this.onopen;
        this.sock.onmessage = this.onmessage;
        this.sock.onclose = this.onclose;
   },
   onopen: function(){
        console.log('open');
        var currentSettings = getSettings();
        var token = currentSettings.getToken();
        var connectionData = {
            action:'authorize',
            data:{
                token:token
            }
        };
        this.sock.send(JSON.stringify(connectionData));
   },
   onmessage: function(e){
       console.log('onmessage');
       console.log(e.data);
   },
   onclose: function(){
       console.log('closed');
   },
});

exports.SockController = SockController;

});
