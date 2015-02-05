'use strict';

var utils = require('./utils');
var Registry = require('./registry');
var renderer;

module.exports = {

  setup: function setup(options, callback) {
    var registry = new Registry(options);
    registry.init(callback);
    renderer = require('./renderer')(options, registry);
  },

  preIntercept: function preIntercept(req, reply) {
    if (utils.isSearchRequest(req)) {
      renderer.renderSearch(req, reply);
      return;
    }
    if (utils.shouldRenderHtml(req)) {
      renderer.render(req, reply);
      return;
    }
    reply();
  },

  postIntercept: function postIntercept(req, reply) {
    if (req.response && req.response.isBoom && utils.shouldRenderHtml(req)) {
      renderer.renderError(req, reply);
      return;
    }
    reply();
  }
};
