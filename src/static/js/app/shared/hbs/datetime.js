define(function(require){
    var handlebars = require('handlebars');

    handlebars.registerHelper("datetime", function(timestamp) {
        if(timestamp){
            return new Date(timestamp*1000);
        }
        return '';
    });
});



