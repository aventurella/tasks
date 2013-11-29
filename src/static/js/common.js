require.config({
  baseUrl: 'static/js',

  paths : {
    'jquery': 'vendor/jquery/jquery',
    'backbone': 'vendor/backbone/backbone',
    'marionette': 'vendor/backbone/marionette',
    'hbs': 'vendor/require/hbs/hbs',

    // used for hbs plugin, name is remapped to
    // lowercase as well for convenience. The optimizer
    // dies, even with the map in place, if we do this
    // any other way.
    //
    // see:
    // https://github.com/SlexAxton/require-handlebars-plugin/issues/144
    'Handlebars': 'vendor/handlebars/handlebars'
  },

   packages: [

        {
            location: 'app',
            name: 'app'
        },

        {
            location: 'vendor/built',
            name: 'built'
        }
    ],

    map: {
        '*': {
            'underscore': 'vendor/underscore/lodash',
            'handlebars': 'Handlebars'
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
        helperDirectory: 'app/hbs/'
  },

  shim : {

    'backbone': {
        'deps': ['jquery', 'underscore'],
        'exports': 'Backbone'
    },

    'marionette': {
        'deps': ['jquery', 'underscore', 'backbone'],
        'exports': 'Marionette'
    }
  }

});