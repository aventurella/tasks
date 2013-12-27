define(function(require, exports, module) {
    var _ = require('underscore');
    var ApplicationDelegate = require('app/delegate').ApplicationDelegate;

    require('jquery/mockjax');

    // gets all users for sidebar (testing function)
    $.mockjax({
        url: '/api/v1/token/me*',
        dataType: 'json',
        responseTime: 750,
        responseText: {'ok': true, 'token': 'mock'}

    });

    ApplicationDelegate.prototype.verifyToken = function(token, deferred){
        deferred.resolve(token);
    };

});
