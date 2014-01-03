define(function( require, exports, module ){

var backbone = require('backbone');
var Tasks = require('app/projects/collections/tasks').Tasks;
var Task = require('app/projects/models/task').Task;

var User = backbone.Model.extend({
    defaults: {
        email:'',
        tasks: new Tasks()
    },
    parse: function(data){
        data.tasks = new Tasks(data.tasks);
        return data;
    },
    toJSON: function(){
        var response = _.clone(this.attributes);
        response.tasks = this.get('tasks').toJSON();
        return response;
    },
});

exports.User = User;

});


 // {
 //     "email":"rfabester@gmail.com",
 //     "tasks":[
 //        {
 //           "created":{

 //           },
 //           "description":"download bootstrap css, don’t touch any css after that.  Learn to use their markup to make your own personal site, host it on github pages and post the link back here\nhome, about, project listing, project detail. ",
 //           "label":"make a website using ONLY bootstrap css",
 //           "last_edited":{

 //           },
 //           "loe":0,
 //           "status":3,
 //           "task_type":0
 //        }
 //     ]
 //  },
