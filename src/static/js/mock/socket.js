define(function(require, exports, module) {

    var SockController = require('app/sockets/sock').SockController;


    SockController.prototype.send = function(data){
        console.log('MOCK SOCKET', data);
    };

});
