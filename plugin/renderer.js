'use strict';

var _ = require('underscore');
var marked = require('marked');
var utils = require('./utils');
var store = require('./store');
var config = require('../config');

var proto = {

  toJSON: function toJSON(data) {
    return _.extend(data, this.defaults);
  },

  renderListPage: function renderListPage(page, req, reply) {

    this.registry.packages(page, function(packages) {
      var data = {
        packages: packages,
        nextPage: page + 1
      };
      reply.view('index', this.toJSON(data));
    });
  },

  renderPackagePage: function renderPackagePage(req, reply) {

    var name = req.url.pathname.slice(1, req.url.pathname.length);
    this.registry.packageInfo(name, function(_package) {
      _package.readme = marked(_package.readme);
      var data = {};
      data['package'] = _package;
      reply.view('package', this.toJSON(data));
    });
  },

  renderError: function renderError(req, reply) {

    var data = {
      error: 'fatal error'
    };
    reply.view('error', this.toJSON(data));
  },

  renderSearch: function renderSearch(req, reply) {

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
  },

  renderHtml: function renderHtml(req, reply) {

    var path = req.url.pathname;
    if (path.length > 1 && path.charAt(path.length - 1) === '/') {
      // remove the trailing '/' - if any from the path
      path = path.substring(0, path.length - 1);
    }

    if (path === '/') {
      this.renderListPage(0, req, reply);
    }
    else if (path.indexOf(config.page.url) !== -1) {
      var page = parseInt(path.replace(config.page.url, ''), 10);
      if (isNaN(page)) {
        // TODO: fix me: throw error or redirect to
        // index instead of rendering page 0
        this.renderListPage(0, req, reply);
      }
      else {
        this.renderListPage(page, req, reply);
      }
    }
    else if (path.split('/').length === 2) {
      // render the package view for urls like
      // http://localhost:8000/<you-pkg-name>
      this.renderPackagePage(req, reply);
    }
    else {
      // dont know what to do at this point!
      // just render whatever it is; as is.
      reply();
    }
  }
};

module.exports.create = function create(title, registry) {

  return Object.create(proto, {

    defaults: {
      value: {
        assetPath: {
          css: config.build.css,
          js: config.build.js
        },
        title: title,
        searchUrl: config.search.url,
        enableSearch: config.search.enable
      },
      configurable: false,
      writable: false,
      enumerable: false
    },

    registry: {
      value: registry,
      configurable: false,
      writable: false,
      enumerable: false
    }
  });
};
