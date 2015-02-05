'use strict';

var utils = require('./utils');
var pkg = require('../package');
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

  Interceptor.create(function onCreate(interceptor) {

    plugin.ext('onRequest', interceptor.preIntercept);
    plugin.ext('onPreResponse', interceptor.postIntercept);

    next();
  });
};

exports.register.attributes = {
  pkg: pkg
};
