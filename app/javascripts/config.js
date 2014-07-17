define(function () {

    'use strict';

    requirejs.config({

        useStrict: true,

        baseUrl: "/app",

        paths: {
            'jquery': 'components/jquery/dist/jquery',
            'typeahead': 'components/typeahead.js/dist/typeahead.jquery'
        },        

        shim: {
            'jquery': {
                exports: 'jQuery'
            },
            'typeahead': {
                deps: ['jquery']
            }
        }        
    });

    require(['javascripts/index']);
});