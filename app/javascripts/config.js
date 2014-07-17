define(function () {

    'use strict';

    requirejs.config({

        useStrict: true,

        baseUrl: "/app",

        paths: {
            'jquery': 'components/jquery/dist/jquery',
            'typeahead': 'components/typeahead.js/dist/typeahead.jquery',
            'jsonHuman': 'components/json-human/src/json.human',
            'crel': 'components/json-human/lib/crel',
            'searchPage': 'javascripts/search',
            'packagePage': 'javascripts/package'
        },        

        shim: {
            'jquery': {
                exports: 'jQuery'
            },
            'typeahead': {
                deps: ['jquery']
            },
            'jsonHuman': {
                deps: ['jquery', 'crel']
            }            
        }        
    });

    require(['javascripts/index']);
});