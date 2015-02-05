'use strict';

var utils = require('./utils');
var pkg = require('../package');
var Registry = require('./registry');
var Renderer = require('./renderer');
var templater = require('./templater');
var Interceptor = require('./interceptor');

exports.register = function register(plugin, options, next) {

  plugin.views({
    engines: {
      html: {
        module: templater
      }
    },
    partialsPath: utils.viewPath,
    path: utils.viewPath,
    isCached: false
  });

  plugin.route({
    method: 'GET',
    path: utils.assestRoute,
    vhost: options.vhost,
    handler: {
      directory: {
        path: utils.assestPath,
        listing: false,
        index: true
      }
    }
  });

  Registry.start(options, function onStart(registry) {

    var renderer = Renderer.create(options.title, registry);
    var interceptor = Interceptor.create(renderer);

    plugin.ext('onRequest', interceptor.onRequest);
    plugin.ext('onPreResponse', interceptor.onPreResponse);

    next();
  });
};

exports.register.attributes = {
  pkg: pkg
};
