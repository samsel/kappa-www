'use strict';

var _ = require('underscore');
var marked = require('marked');
var utils = require('./utils');
var store = require('./store');
var config = require('../config');

module.exports = function renderer(options, registry) {

  var defaults = {
    assetPath: {
      css: config.build.css,
      js: config.build.js
    },
    title: options.title,
    searchUrl: config.search.url,
    enableSearch: config.search.enable
  };

  function renderListPage(page, req, reply) {
    registry.packages(page, function(packages) {

      var data = _.extend({
        packages: packages,
        nextPage: page + 1
      }, defaults);

      reply.view('index', data);
    });
  }

  function renderPackagePage(req, reply) {
    var name = req.url.pathname.slice(1, req.url.pathname.length);
    registry.packageInfo(name, function(_package) {
      var obj = {};
      obj['package'] = _package;
      var data = _.extend(obj, defaults);
      _package.readme = marked(_package.readme);

      reply.view('package', data);
    });
  }

  function renderError(req, reply) {
    var data = _.extend({
      error: 'fatal error'
    }, defaults);

    reply.view('error', data);
  }

  function render(req, reply) {
    var path = req.url.pathname;
    if (path.length > 1 && path.charAt(path.length - 1) === '/') {
      // remove the trailing '/' - if any from the path
      path = path.substring(0, path.length - 1);
    }

    if (path === '/') {
      renderListPage(0, req, reply);
    }
    else if (path.indexOf(config.page.url) !== -1) {
      var page = parseInt(path.replace(config.page.url, ''), 10);
      if (isNaN(page)) {
        // TODO: fix me: throw error or redirect to
        // index instead of rendering page 0
        renderListPage(0, req, reply);
      }
      else {
        renderListPage(page, req, reply);
      }
    }
    else if (path.split('/').length === 2) {
      // render the package view for urls like
      // http://localhost:8000/<you-pkg-name>
      renderPackagePage(req, reply);
    }
    else {
      // dont know what to do at this point!
      // just render whatever it is; as is.
      reply();
    }
  }

  function renderSearch(req, reply) {
    var key = utils.searchKeyFromRequest(req);

    function onSearch(err, packages) {
      if (err) {
        return reply({
          error: {
            message: err.message
          }
        });
      }

      reply(packages);
    }

    store.search(key, onSearch);
  }

  return {
    render: render,
    renderError: renderError,
    renderSearch: renderSearch
  };
};
