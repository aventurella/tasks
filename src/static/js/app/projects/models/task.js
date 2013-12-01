define(function(require, exports, module) {

var backbone = require('backbone');

var Task = backbone.Model.extend({
    defaults: {
        label: null,
        description: null,
        levelofEffort: 'medium'
    }
});

exports.Task = Task;

});
