'use strict';

var utils = require('./utils');
var Registry = require('./registry');

var proto = {

  preIntercept: function preIntercept(req, reply) {
    if (utils.isSearchRequest(req)) {
      this.renderer.renderSearch(req, reply);
      return;
    }

    if (utils.shouldRenderHtml(req)) {
      this.renderer.render(req, reply);
      return;
    }

    reply();
  },

  postIntercept: function postIntercept(req, reply) {
    if (req.response && req.response.isBoom && utils.shouldRenderHtml(req)) {
      this.renderer.renderError(req, reply);
      return;
    }

    reply();
  }
};

module.exports.create = function create(options, done) {

    var registry = new Registry(options);
    var renderer = require('./renderer')(options, registry);

    var interceptor = Object.create(proto, {
      renderer: {
        value: renderer,
        enumerable: false,
        configurable: false,
        writable: false
      }
    });

    registry.init(function() {
      done(interceptor);
    });
};
