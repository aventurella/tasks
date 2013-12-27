define(function(require, exports, module) {
    var _ = require('underscore');
    require('jquery/mockjax');

    // gets all users for sidebar (testing function)
    $.mockjax({
        type: 'PUT',
        url: '/api/v1/task*',
        responseTime: 750,

        response: function(settings){
            var data = JSON.parse(settings.data);
            this.responseText = data;
        }
    });


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
        url: '/api/v1/task*',
        responseTime: 750,
        response: function(settings){
            var response = {'objects': [
            {'assigned_email': 'aventurella@gmail.com', 'description': 'If you are in the app, and command + w, you have to quit and restart', 'id': 7, 'label': '[MOCK] ability to open new window somehow', 'loe': 0, 'project': {'id': 3, 'label': 'Tasks', 'resource_uri': '/api/v1/project/3/'}, 'resource_uri': '/api/v1/task/7/', 'status': 4, 'task_type': 1},
            {'assigned_email': '', 'description': 'use an input select to type there name, then notify that person via push?', 'id': 14, 'label': '[MOCK] add ability to assign task to someone', 'loe': 0, 'project': {'id': 3, 'label': 'Tasks', 'resource_uri': '/api/v1/project/3/'}, 'resource_uri': '/api/v1/task/14/', 'status': 0, 'task_type': 0},
            {'assigned_email': 'dinopetrone@gmail.com', 'description': 'have a number to the right of the project showing the number of tasks that are in backlog + todo.  have that update via push', 'id': 9, 'label': '[MOCK] Add number of tasks as project attribute', 'loe': 0, 'project': {'id': 3, 'label': 'Tasks', 'resource_uri': '/api/v1/project/3/'}, 'resource_uri': '/api/v1/task/9/', 'status': 5, 'task_type': 0},
            {'assigned_email': '', 'description': 'Ability to be part of multiple organizations and easily swap between then (needs data change of user model)', 'id': 16, 'label': '[MOCK] Organization switching', 'loe': 0, 'project': {'id': 3, 'label': 'Tasks', 'resource_uri': '/api/v1/project/3/'}, 'resource_uri': '/api/v1/task/16/', 'status': 0, 'task_type': 0},
            {'assigned_email': 'aventurella@gmail.com', 'description': '', 'id': 27, 'label': '[MOCK] Swimlanes need overflow-y: auto so they can scroll.', 'loe': 0, 'project': {'id': 3, 'label': 'Tasks', 'resource_uri': '/api/v1/project/3/'}, 'resource_uri': '/api/v1/task/27/', 'status': 3, 'task_type': 0},
            {'assigned_email': 'dinopetrone@gmail.com', 'description': '', 'id': 25, 'label': '[MOCK] Disable pagination data in API response.', 'loe': 0, 'project': {'id': 3, 'label': 'Tasks', 'resource_uri': '/api/v1/project/3/'}, 'resource_uri': '/api/v1/task/25/', 'status': 4, 'task_type': 0},
            {'assigned_email': 'dinopetrone@gmail.com', 'description': '', 'id': 19, 'label': '[MOCK] Add id’s to tasks and bugs', 'loe': 0, 'project': {'id': 3, 'label': 'Tasks', 'resource_uri': '/api/v1/project/3/'}, 'resource_uri': '/api/v1/task/19/', 'status': 4, 'task_type': 0},
            {'assigned_email': 'aventurella@gmail.com', 'description': '', 'id': 10, 'label': '[MOCK] Rename \'in-process\' to \'active\'', 'loe': 0, 'project': {'id': 3, 'label': 'Tasks', 'resource_uri': '/api/v1/project/3/'}, 'resource_uri': '/api/v1/task/10/', 'status': 4, 'task_type': 0},
            {'assigned_email': '', 'description': 'Thoughts on this adam?', 'id': 22, 'label': '[MOCK] in app, command + R refreshes the app', 'loe': 0, 'project': {'id': 3, 'label': 'Tasks', 'resource_uri': '/api/v1/project/3/'}, 'resource_uri': '/api/v1/task/22/', 'status': 5, 'task_type': 0},
            {'assigned_email': 'dinopetrone@gmail.com', 'description': '', 'id': 32, 'label': '[MOCK] deleting tasks need to send socket event', 'loe': 0, 'project': {'id': 3, 'label': 'Tasks', 'resource_uri': '/api/v1/project/3/'}, 'resource_uri': '/api/v1/task/32/', 'status': 4, 'task_type': 0},
            {'assigned_email': '', 'description': 'have ability to view comments and add comments to a task', 'id': 11, 'label': '[MOCK] Add comments', 'loe': 2, 'project': {'id': 3, 'label': 'Tasks', 'resource_uri': '/api/v1/project/3/'}, 'resource_uri': '/api/v1/task/11/', 'status': 0, 'task_type': 0},
            {'assigned_email': '', 'description': 'https://www.evernote.com/shard/s26/sh/aa13776b-adfc-4e64-9264-796f4730cf1b/4bb33f69d1a574aa117f44a5a8c94de2', 'id': 12, 'label': 'fix spacing on backlog view', 'loe': 0, 'project': {'id': 3, 'label': 'Tasks', 'resource_uri': '/api/v1/project/3/'}, 'resource_uri': '/api/v1/task/12/', 'status': 0, 'task_type': 1},
            {'assigned_email': 'dinopetrone@gmail.com', 'description': 'http://note.io/1fFh9Wo', 'id': 13, 'label': '[MOCK] style add task button', 'loe': 0, 'project': {'id': 3, 'label': 'Tasks', 'resource_uri': '/api/v1/project/3/'}, 'resource_uri': '/api/v1/task/13/', 'status': 4, 'task_type': 0},
            {'assigned_email': 'dinopetrone@gmail.com', 'description': '', 'id': 30, 'label': '[MOCK] Add Delete Task Functionality', 'loe': 0, 'project': {'id': 3, 'label': 'Tasks', 'resource_uri': '/api/v1/project/3/'}, 'resource_uri': '/api/v1/task/30/', 'status': 4, 'task_type': 0},
            {'assigned_email': 'dinopetrone@gmail.com', 'description': 'i\'m thinking something like this:\nhttp://note.io/19N749j\ninstead of this:\nhttp://note.io/19N7894', 'id': 24, 'label': '[MOCK] make the move buttons a drop down ', 'loe': 0, 'project': {'id': 3, 'label': 'Tasks', 'resource_uri': '/api/v1/project/3/'}, 'resource_uri': '/api/v1/task/24/', 'status': 4, 'task_type': 0},
            {'assigned_email': '', 'description': '', 'id': 18, 'label': '[MOCK] When switching projects, let the user know something is happening', 'loe': 0, 'project': {'id': 3, 'label': 'Tasks', 'resource_uri': '/api/v1/project/3/'}, 'resource_uri': '/api/v1/task/18/', 'status': 0, 'task_type': 0},
            {'assigned_email': 'aventurella@gmail.com', 'description': 'Currently, when you hit save for a new task there is a delay before the ui responds. It feels awkward and unresponsive. It’s there because we delay the task saving so we get the ID. I think accomplishing that is still doable while letting the user move on their way.', 'id': 26, 'label': '[MOCK] Better UI Response when createing a task', 'loe': 0, 'project': {'id': 3, 'label': 'Tasks', 'resource_uri': '/api/v1/project/3/'}, 'resource_uri': '/api/v1/task/26/', 'status': 4, 'task_type': 0},
            {'assigned_email': '', 'description': 'Uncaught TypeError: Cannot call method \'add\' of undefined \nhokeys.js line 31', 'id': 31, 'label': 'hotkeys error', 'loe': 0, 'project': {'id': 3, 'label': 'Tasks', 'resource_uri': '/api/v1/project/3/'}, 'resource_uri': '/api/v1/task/31/', 'status': 4, 'task_type': 1},
            {'assigned_email': '', 'description': '', 'id': 20, 'label': '[MOCK] notify user when the socket connection is lost', 'loe': 0, 'project': {'id': 3, 'label': 'Tasks', 'resource_uri': '/api/v1/project/3/'}, 'resource_uri': '/api/v1/task/20/', 'status': 1, 'task_type': 0},
            {'assigned_email': 'dinopetrone@gmail.com', 'description': '', 'id': 33, 'label': '[MOCK] add cancel key for task menu', 'loe': 0, 'project': {'id': 3, 'label': 'Tasks', 'resource_uri': '/api/v1/project/3/'}, 'resource_uri': '/api/v1/task/33/', 'status': 4, 'task_type': 0}]};

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
