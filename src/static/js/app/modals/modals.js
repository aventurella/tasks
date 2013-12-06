define(function(require, exports, module) {

var vent = require('app/vent').vent;
var events = require('./events');
var ModalView = require('./views/modal').ModalView;

var currentModal = null;

var queue = [];

function presentModal(view){


    var modalView = new ModalView({itemView: view});
    queue.push(modalView);

    if(queue.length === 1){
        triggerModal(modalView);
    }

    return modalView;
}

function triggerModal(modalView){
    currentModal = modalView;
    vent.trigger(events.PRESENT, currentModal);
}

function nextModal(){
    if(queue.length > 0) queue.shift();
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
