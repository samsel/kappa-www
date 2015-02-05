'use strict';

var utils = require('./utils');
var pkg = require('../package');
var templater = require('./templater');
var interceptor = require('./interceptor');

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

  plugin.ext('onRequest', interceptor.preIntercept);
  plugin.ext('onPreResponse', interceptor.postIntercept);

  interceptor.setup(options, next);
};

exports.register.attributes = {
  pkg: pkg
};
