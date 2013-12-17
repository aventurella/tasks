define(function (require, exports, module) {

var marionette = require('marionette');
var getSettings = require('app/settings/defaults').getSettings;
var vent = require('app/vent').vent;

require('sockjs');

var SockController = marionette.Controller.extend({

   initialize : function(){
        _.bindAll(this, 'onopen', 'onAuthComplete', 'onclose', 'ventDispatchMessage');
        this.sock = new SockJS('http://127.0.0.1:8888');
        this.sock.onopen = this.onopen;
        this.sock.onmessage = this.onAuthComplete;
        this.sock.onclose = this.onclose;
   },
   onopen: function(){
        this.currentSettings = getSettings();
        var token = this.currentSettings.getToken();
        var connectionData = {
            action:'authorize',
            data:{
                token:token
            }
        };
        this.sock.send(JSON.stringify(connectionData));
   },
   onAuthComplete: function(e){
        var data = JSON.parse(e.data);
        this.currentSettings.setUser(data)
        this.sock.onmessage = this.ventDispatchMessage;
   },
   ventDispatchMessage: function(e){
       var data = JSON.parse(e.data);
       var event = 'model:update:'+ data.type + ':' + data.id;
       console.log(event)
       vent.trigger(event, data);
   },

   setActiveProjectId: function(id){
       var connectionData = {
            action:'set_project',
            data:{
                project_id:id
            }
        };
       this.sock.send(JSON.stringify(connectionData));
   },

   onclose: function(){
       console.log('closed');
   },
});

exports.SockController = SockController;

});
