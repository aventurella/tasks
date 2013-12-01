define(function(require, exports, module) {

var vent = require('app/vent').vent;
var ModalView = require('./views/modal').ModalView;

var currentModal = null;


function presentModal(view){

    // only 1 modal at a time please.
    if(currentModal) return;

    currentModal = new ModalView({itemView: view});

    vent.trigger('application:modal:present', currentModal);
    return currentModal;
}

function dismissModal(){
    vent.trigger('application:modal:dismiss', currentModal);
    currentModal = null;
}

exports.presentModal = presentModal;
exports.dismissModal = dismissModal;
});
