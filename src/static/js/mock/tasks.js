define(function(require, exports, module) {
    var _ = require('underscore');
    require('jquery/mockjax');

    // gets all users for sidebar (testing function)
    $.mockjax({
        type: 'POST',
        url: '/api/v1/task*',
        responseTime: 750,

        response: function(settings){
            var data = JSON.parse(settings.data);
            var id = _.uniqueId();

            var response = {
                'assigned_email': '',
                'description': data.description,
                'id': id,
                'label': '[MOCK]' + data.label,
                'loe': data.loe,
                'project': data.project,
                'resource_uri': '/api/v1/task/' + id + '/',
                'status': data.status,
                'task_type': data.task_type
            };

            this.responseText = response;
        }
    });

    $.mockjax({
        type: 'GET',
        url: '/api/v1/project*',
        responseTime: 750,
        responseText: {

        'objects': [
            {'id': 1, 'label': '[MOCK] Built', 'resource_uri': '/api/v1/project/1/'},
            {'id': 3, 'label': '[MOCK] Tasks', 'resource_uri': '/api/v1/project/3/'}
            ]
        }
    });
});
