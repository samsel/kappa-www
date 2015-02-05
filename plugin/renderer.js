'use strict';

var _ = require('underscore');
var marked = require('marked');
var utils = require('./utils');
var store = require('./store');
var config = require('../config');
var urlParser = require('github-url-from-git');

var helpers = {

  toJSON: function toJSON(data) {
    return _.extend(data, this.meta);
  },

  addWebURLForPackage: function addWebURLForPackage(pkg) {
    if (pkg.repository && pkg.repository.url) {
      pkg.repository.webURL = urlParser(pkg.repository.url, {
        extraBaseUrls: this.meta.gitDomain
      });
    }

    return pkg;
  },

  renderListPage: function renderListPage(page, req, reply) {

    store.get(page, function(err, packages) {
      if (err) {
        // to do log error
        this.render.error(req, reply);
        return;
      }

      var data = {
        packages: packages.map(this.helpers.addWebURLForPackage, this),
        nextPage: page + 1
      };

      reply.view('index', this.toJSON(data));
    });
  },

  renderPackagePage: function renderPackagePage(req, reply) {

    var name = req.url.pathname.slice(1, req.url.pathname.length);
    this.registry.packageInfo(name, function(err, _package) {

      if (err) {
        // to do log error
        this.render.error(req, reply);
        return;
      }

      _package = this.helpers.addWebURLForPackage(_package);
      _package.readme = marked(_package.readme);
      var data = {};
      data['package'] = _package;

      reply.view('package', this.toJSON(data));
    });
  }
};

var render = {

  error: function error(req, reply) {

    var data = {
      error: 'fatal error'
    };
    reply.view('error', this.helpers.toJSON(data));
  },

  search: function search(req, reply) {

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

  html: function html(req, reply) {

    var path = req.url.pathname;
    if (path.length > 1 && path.charAt(path.length - 1) === '/') {
      // remove the trailing '/' - if any from the path
      path = path.substring(0, path.length - 1);
    }

    if (path === '/') {
      this.helpers.renderListPage(0, req, reply);
    }
    else if (path.indexOf(config.page.url) !== -1) {
      var page = parseInt(path.replace(config.page.url, ''), 10);
      if (isNaN(page)) {
        // TODO: fix me: throw error or redirect to
        // index instead of rendering page 0
        this.helpers.renderListPage(0, req, reply);
      }
      else {
        this.helpers.renderListPage(page, req, reply);
      }
    }
    else if (path.split('/').length === 2) {
      // render the package view for urls like
      // http://localhost:8000/<you-pkg-name>
      this.helpers.renderPackagePage(req, reply);
    }
    else {
      // dont know what to do at this point!
      // just render whatever it is; as is.
      reply();
    }
  }
};

module.exports.create = function create(title, gitDomain, registry) {

  return Object.create({

    meta: {
      value: {
        assetPath: {
          css: config.build.css,
          js: config.build.js
        },
        title: title,
        gitDomain: (gitDomain || config.defaultDomain),
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
    },

    helpers: {
      value: helpers,
      configurable: false,
      writable: false,
      enumerable: false
    },

    render: {
      value: render,
      configurable: false,
      writable: false,
      enumerable: true
    }
  });
};
