define(function(require, exports, module) {

var SampleView = require('app/sample/views').SampleView;
var Model      = require('backbone').Model;

function main(options){
    var app = this;

    app.addRegions({
        window: '#window'
    });

    var model = new Model({
        message: 'Build something!'
    });

    app.window.show(new SampleView({model: model}));
}

exports.main = main;
});
