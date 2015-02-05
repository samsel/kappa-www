define(function config() {

  'use strict';

  var config = {
    useStrict: true,
    baseUrl: '/public',
    paths: {
      jquery: 'components/jquery/dist/jquery',
      typeahead: 'components/typeahead.js/dist/typeahead.jquery'
    },
    shim: {
      jquery: {
        exports: 'jQuery'
      },
      typeahead: {
        deps: ['jquery']
      }
    }
  };

  requirejs.config(config);
  require(['javascripts/search']);
});
