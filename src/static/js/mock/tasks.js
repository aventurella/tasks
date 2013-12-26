
define(function(require, exports, module) {
    require('jquery/mockjax');

    // gets all users for sidebar (testing function)
    // admin/sidebar/collections/users.js
    $.mockjax({
        url: '/api/v1/user/',
        responseTime: 750,
        data:{
            search:'asdfasdf'
        },
        responseText: {
            ok: 'true',
            data: [{
                id: '1',
                label: 'Dino Petrone',
                first_name: 'Dino',
                last_name: 'Petrone',
                username: 'dinopetrone',
                email: 'dinopetrone@blitzagency.com',
                enabled: true
            }]
        }
    });
});
