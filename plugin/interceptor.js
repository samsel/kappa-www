'use strict';

var utils = require('./utils');

var proto = {

  onRequest: function preIntercept(req, reply) {
    if (utils.isSearchRequest(req)) {
      this.renderer.renderSearch(req, reply);
      return;
    }

    if (utils.shouldRenderHtml(req)) {
      this.renderer.renderHtml(req, reply);
      return;
    }

    reply();
  },

  onPreResponse: function postIntercept(req, reply) {
    if (req.response && req.response.isBoom && utils.shouldRenderHtml(req)) {
      this.renderer.renderError(req, reply);
      return;
    }

    reply();
  }
};

module.exports.create = function create(renderer) {

  return Object.create(proto, {
    renderer: {
      value: renderer,
      enumerable: false,
      configurable: false,
      writable: false
    }
  });
};
