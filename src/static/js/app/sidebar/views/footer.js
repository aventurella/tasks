define(function(require, exports, module) {

var marionette = require('marionette');


var FooterView = marionette.ItemView.extend({
    triggers:{
        'click .action.add': 'project:add'
    },

    onShow: function(){
    }

});

exports.FooterView = FooterView;

});
