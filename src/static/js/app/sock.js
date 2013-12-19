define(function (require, exports, module) {

var marionette = require('marionette');
var getSettings = require('app/settings/defaults').getSettings;
var vent = require('app/vent').vent;

require('sockjs');

var SockController = marionette.Controller.extend({

   initialize : function(){
        _.bindAll(this, 'onopen', 'onAuthComplete', 'onclose', 'ventDispatchMessage');
        this._connection = $.Deferred();
        this._login = $.Deferred();
   },

   onopen: function(){
        this._connection.resolve();
        this.trigger('connected');
   },

   connect: function(){
        if(!this.sock){
            this.sock = new SockJS('http://127.0.0.1:8888');
            this.sock.onopen = this.onopen;
            this.sock.onmessage = this.onAuthComplete;
            this.sock.onclose = this.onclose;
        }

        return this._connection.promise();
   },

   login: function(token){
        var connectionData = {
            action:'authorize',
            data:{
                token:token
            }
        };
        this.token = token;
        this.sock.send(JSON.stringify(connectionData));
        return this._login.promise();
   },

   onAuthComplete: function(e){
        var data = JSON.parse(e.data);
        var currentSettings;

        if(!data.ok){
            this.trigger('login:fail');
            this._login.reject();
            return;
        }

        getSettings().setUser(data.data);
        this.trigger('login:success');
        this._login.resolve(data.data);

        this.sock.onmessage = this.ventDispatchMessage;
   },

   ventDispatchMessage: function(e){
       var data = JSON.parse(e.data);

       switch(data.action){
            case 'update':
                this.updateTask(data);
                break;
            case 'create':
                // if(data.token == this.token)return;
                this.createTask(data);
       }

   },

   updateTask: function(data){
       var model = this.tasks.get(data.id);
       model.doUpdateModel(data);
   },

   createTask: function(data){
       this.tasks.add(data);
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

   setTasksCollection: function(tasks){
       this.tasks = tasks;
   },

   onclose: function(){
       console.log('closed');
   },
});

exports.SockController = SockController;


});
