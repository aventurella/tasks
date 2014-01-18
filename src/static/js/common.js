// common.js loads first
var Bridge = window.Bridge || undefined;
var STATE = {DEV: 1 << 0 , PROD: 1 << 1, MOCK: 1 << 2, BROWSER: 1 << 3, COCOA: 1 << 4};

require.config({
  baseUrl: 'static/js',

  paths : {
    'marionette': 'vendor/backbone/marionette',
    'hbs': 'vendor/require/hbs/hbs',
    'cond': 'vendor/require/cond/cond',

    // used for hbs plugin, name is remapped to
    // lowercase as well for convenience. The optimizer
    // dies, even with the map in place, if we do this
    // any other way.
    //
    // see:
    // https://github.com/SlexAxton/require-handlebars-plugin/issues/144
    'Handlebars': 'vendor/handlebars/handlebars'
  },

    config: {
        'cond': {
            // PRODUCTION_APP
            // state: STATE.PROD|STATE.COCOA

            // PRODUCTION_BROWSER
            // state: STATE.PROD|STATE.BROWSER

            // LOCAL_DEV
            state: STATE.DEV|STATE.BROWSER

            // LOCAL_DEV_MOCKS
            // state: STATE.DEV|STATE.BROWSER|STATE.MOCK
        }
    },

   packages: [

        {
            location: 'app',
            name: 'app'
        },

        {
            location: 'vendor/backbone',
            name: 'backbone',
            main:'backbone'
        },

        {
            location: 'vendor/jquery',
            name: 'jquery',
            main:'jquery'
        },

         {
            location: 'vendor/sockjs',
            name: 'sockjs',
            main:'sockjs'
        },

        {
            location: 'vendor/built',
            name: 'built'
        }
    ],

    map: {
        '*': {
            'underscore': 'vendor/underscore/lodash',
            'handlebars': 'Handlebars',
        },

        'app/session/session':{
            'driver': 'app/session/drivers/xhr'
        },

        'hbs':{
            'i18nprecompile' : 'vendor/require/hbs/i18nprecompile',
            'json2' : 'vendor/require/hbs/json2',
            'underscore': 'vendor/require/hbs/underscore'
        }
    },

  hbs: {
        templateExtension : 'html',
        // if disableI18n is `true` it won't load locales and the i18n helper
        // won't work as well.
        disableI18n : true,
        helperDirectory: 'app/shared/hbs/'
  },

  shim : {

    'backbone': {
        'deps': ['jquery', 'underscore'],
        'exports': 'Backbone'
    },

    'backbone/stickit' : {
      'deps' : ['backbone'],
      'exports' : 'Stickit'
    },

    'jquery/mockjax': {
        'deps': ['jquery'],
        'exports': 'jquery'
    },

    'marionette': {
        'deps': ['jquery', 'underscore', 'backbone'],
        'exports': 'Marionette'
    }
  }

});
