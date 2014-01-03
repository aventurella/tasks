define(function( require, exports, module ){

var backbone = require('backbone');
var User = require('../models/user').User;
var domain = require('app/settings/defaults').getSettings().getApiDomain();

var Users =  backbone.Collection.extend({
    url:  domain + '/api/v1/organization/',
    model: User,
    parse: function(response){
        return response.objects;
    },
});

exports.Users = Users;

/*
{
    "meta": {
        "limit": 1000,
        "next": null,
        "offset": 0,
        "previous": null,
        "total_count": 4
    },
    "objects": [
        {
            "email": "rfabester@gmail.com",
            "tasks": [
                {
                    "created": {
                        "datetime": "1388507592",
                        "user_email": "rfabester@gmail.com"
                    },
                    "description": "fonts:\n<script type=\"text/javascript\" src=\"http://fast.fonts.net/jsapi/b87dc293-6558-4d28-ab55-3a7c26c8db42.js\"></script>\nfont name variables:\n$ProximaRegular:\t\t\t\"Proxima N W15 Reg\";\n$ProximaSemiBold:\t\t\t\"Proxima N W15 Smbd\";\n$ProximaThin:\t\t\t\t\"Proxima N W01 Thin Reg\";\n$DinNextCondensed:          \"DINNextW01-CondensedLig\";",
                    "label": "setup styles.html file with ALL common elements on it, styled correctly",
                    "last_edited": {
                        "datetime": "1388692812",
                        "user_email": "rfabester@gmail.com"
                    },
                    "loe": 0,
                    "status": 3,
                    "task_type": 0
                }
            ]
        },
        {
            "email": "aubricus@gmail.com",
            "tasks": []
        },
        {
            "email": "dinopetrone@gmail.com",
            "tasks": [
                {
                    "created": {
                        "datetime": "1388729740",
                        "user_email": "dinopetrone@gmail.com"
                    },
                    "description": "use an input select to type there name, then notify that person via push?",
                    "label": "add ability to assign task to someone",
                    "last_edited": {
                        "datetime": "1388729740",
                        "user_email": "dinopetrone@gmail.com"
                    },
                    "loe": 0,
                    "status": 3,
                    "task_type": 0
                }
            ]
        },
        {
            "email": "aventurella@gmail.com",
            "tasks": [
                {
                    "created": {
                        "datetime": "1388690888",
                        "user_email": "dinopetrone@gmail.com"
                    },
                    "description": "",
                    "label": "style out the organization level view",
                    "last_edited": {
                        "datetime": "1388719090",
                        "user_email": "aventurella@gmail.com"
                    },
                    "loe": 0,
                    "status": 3,
                    "task_type": 0
                }
            ]
        }
    ]
}
*/

});
