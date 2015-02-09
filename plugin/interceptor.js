'use strict';

var utils = require('./utils');

module.exports.create = function create(render) {

  return {

    onRequest: function preIntercept(req, reply) {
      if (utils.isSearchRequest(req)) {
        render.search(req, reply);
        return;
      }

      if (utils.shouldRenderHtml(req)) {
        render.html(req, reply);
        return;
      }

      reply();
    },

    onPreResponse: function postIntercept(req, reply) {
      if (req.response && req.response.isBoom && utils.shouldRenderHtml(req)) {
        render.error(req, reply);
        return;
      }

      reply();
    }
  };

};
