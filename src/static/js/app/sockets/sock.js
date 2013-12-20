define(function (require, exports, module) {

var marionette = require('marionette');
var getSettings = require('app/settings/defaults').getSettings;
var TasksProtocol = require('./tasks').TasksProtocol;
var events = require('./events');

require('sockjs');

var SockController = marionette.Controller.extend({

   initialize : function(options){
        _.bindAll(this, 'onopen', 'onAuthComplete', 'onclose', 'handleMessage');
        this._connection = $.Deferred();
        this._login = $.Deferred();

        this.tasks = options.tasks;
        this.taskProtocol = new TasksProtocol({tasks: this.tasks});
   },

   onopen: function(){
        this._connection.resolve();
        this.trigger(events.CONNECT);
   },

   connect: function(){
        if(!this.sock){
            this.sock = new SockJS('http://127.0.0.1:8888');
            this.sock.onopen = this.onopen;
            this.sock.onmessage = this.onAuthComplete;
            this.sock.onclose = this.onclose;
        }
        this.trigger('connected');
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

        this.sock.onmessage = this.handleMessage;
   },

   handleMessage: function(e){
       var data = JSON.parse(e.data);
       this.taskProtocol.handleMessage(data);
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
       this.trigger(events.DISCONNECT);
       this.sock = null;
       // should set a timeout and then notify
       // them of a countdown? re:slack?
       // this.connect();
       var self = this;
       setTimeout(function(){
        self.connect();
       }, 5000);
   },
});

exports.SockController = SockController;


});
