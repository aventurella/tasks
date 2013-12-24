define(function(require){
    var handlebars = require('handlebars');
    require('vendor/encrypt/md5');

    function mdfive (email) {
        console.log(email)
        email = email || '';
        return hex_md5(email);
    }

    handlebars.registerHelper('mdfive', mdfive);
    return mdfive;
});
