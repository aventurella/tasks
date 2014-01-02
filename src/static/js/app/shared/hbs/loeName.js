define(function(require){
    var handlebars = require('handlebars');

    var loe = {
        0: 'easy',
        1: 'medium',
        2: 'mard'
    };

    function action (value) {
        return loe[value] || 'unknown';
    }

    handlebars.registerHelper('loeName', action);
    return action;
});
