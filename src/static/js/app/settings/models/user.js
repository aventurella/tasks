define(function( require, exports, module ){

var backbone = require('backbone');
var SettingsUser = backbone.Model.extend({
    defaults:{
        first_name: null,
        last_name: null,
        organization: null,
        organization_id: null
    }
});

exports.SettingsUser = SettingsUser;

});



