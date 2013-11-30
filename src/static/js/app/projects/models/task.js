define(function(require, exports, module) {

var backbone = require('backbone');

var Task = backbone.Model.extend({
    defaults: {
        label: null,
        levelofEffort: 'medium'
    }
});

exports.Task = Task;

});
