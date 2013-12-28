define(function (require, exports, module) {

var marionette = require('marionette');

var modals = require('built/app/modals');

var getSettings = require('app/settings/defaults').getSettings;
var socketDomain = require('app/settings/defaults').getSettings().getSocketDomain();
var SocketConnectingView = require('app/modals/views/sockets').SocketConnectingView;

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
            this.sock = new SockJS(socketDomain);
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
        this.send(connectionData);
        this._login = $.Deferred();
        return this._login.promise();
   },

    send: function(data){
        var payload = JSON.stringify(data);
        this.sock.send(payload);
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
        this._project_id = id;
        if(Bridge) Bridge.currentProjectId = id;
        this.send(connectionData);
   },

   onclose: function(){
       this.trigger(events.DISCONNECT);
       // SocketConnectingView
       this.showModal();
       this.sock = null;
       // should set a timeout and then notify
       // them of a countdown? re:slack?
       // this.connect();
       var self = this;
       setTimeout(function(){
        self.connect();
       }, 5000);
   },
   showModal: function(){
       modals.presentModal(new SocketConnectingView());

       this.once(events.CONNECT, function(){
            modals.dismissModal();
            this.tasks.fetch({data: {project__id: this._project_id}});
       });

   },
});

exports.SockController = SockController;


});
