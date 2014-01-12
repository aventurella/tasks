/**
 * @license RequireJS text 2.0.10 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */
/*jslint regexp: true */
/*global require, XMLHttpRequest, ActiveXObject,
  define, window, process, Packages,
  java, location, Components, FileUtils */

define(function(require, exports, module) {

function conditionalLoad(id, require, load, config){
    var options = module.config();

    map = {
        'mock/init': loadMocks,
        'app/settings/driver': loadSettingsDriver,
        'app/settings/urls': loadSettingsUrls
    };

    action = map[id] || false;

    if(action){
        var obj = action(options.state);

        if(obj.ok){
            obj.data ? load(obj.data) : require([obj.id || id], load);
        } else {
            load();
        }
    }
}

function loadMocks(state){
    // we may or may not need to load the mocks:
    // start with ok: false
    obj = {ok: false};

    if (STATE.MOCK & state)
        obj.ok = true;

    return obj;

}

function loadSettingsDriver(state){
    // we always have to load one driver
    // so start with ok: true;
    obj = {ok: true};

    if(STATE.BROWSER & state){
        obj.id = 'app/settings/drivers/html-local-storage';
    } else if (STATE.COCOA & state){
        obj.id = 'app/settings/drivers/cocoa';
    } else {
        throw new Error('Neiter STATE.BROWSER or STATE.COCOA was specified');
    }

    return obj;
}

function loadSettingsUrls(state){
    // we always need some url regardless,
    // so start with ok: true;
    obj = {ok: true};

    var data = {
        socket: null,
        api: null
    };

    if(STATE.DEV & state){
        data.socket = 'http://localhost:8888';
        data.api = 'http://localhost:8000';
    } else {
        data.socket = 'http://54.242.250.233:8888';
        data.api = 'http://54.242.250.233';
    }

    obj.data = data;
    return obj;
}

exports.load = conditionalLoad;

});
