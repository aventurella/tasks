define(function(require, exports, module) {

var vent = require('app/vent').vent;
var events = require('./events');
var ModalView = require('./views/modal').ModalView;

var currentModal = null;

var queue = [];

function presentModal(view){

    var deferred = $.Deferred();

    var modalView = new ModalView({itemView: view});
    queue.push(modalView);

    modalView.once(events.COMPLETE, function(){
        deferred.resolve(modalView);
    });

    if(queue.length === 1){
        triggerModal(modalView);
    }

    return deferred.promise();
}

function triggerModal(modalView){
    currentModal = modalView;
    vent.trigger(events.PRESENT, currentModal);
}

function nextModal(){

    if(queue.length > 0) {
        queue.shift();
        currentModal = null;
    }

    if(queue.length === 0) return;
    triggerModal(queue[0]);
}

function dismissModal(){
    vent.trigger(events.DISMISS, currentModal);
}

exports.presentModal = presentModal;
exports.dismissModal = dismissModal;
exports.nextModal = nextModal;
});
