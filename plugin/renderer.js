'use strict';

var _ = require('underscore');
var marked = require('marked');
var utils = require('./utils');
var store = require('./store');
var config = require('../config');
var urlParser = require('github-url-from-git');

module.exports.create = function create(title, gitDomain, registry) {

  var meta;
  var render;
  var helpers;

  meta = {
    assetPath: {
      css: config.build.css,
      js: config.build.js
    },
    title: title,
    gitDomain: (gitDomain || config.defaultDomain),
    searchUrl: config.search.url,
    enableSearch: config.search.enable
  };

  helpers = {

    toJSON: function toJSON(data) {
      return _.extend(data, meta);
    },

    addWebURLForPackage: function addWebURLForPackage(pkg) {
      if (pkg.repository && pkg.repository.url) {
        pkg.repository.webURL = urlParser(pkg.repository.url, {
          extraBaseUrls: meta.gitDomain
        });
      }

      return pkg;
    },

    renderListPage: function renderListPage(page, req, reply) {

      store.get(page, function(err, packages) {
        if (err) {
          // to do log error
          render.error(req, reply);
          return;
        }

        var data = {
          packages: packages.map(helpers.addWebURLForPackage, this),
          nextPage: page + 1
        };

        reply.view('index', helpers.toJSON(data));
      });
    },

    renderPackagePage: function renderPackagePage(req, reply) {

      var name = req.url.pathname.slice(1, req.url.pathname.length);
      registry.packageInfo(name, function(err, _package) {

        if (err) {
          // to do log error
          render.error(req, reply);
          return;
        }

        _package = helpers.addWebURLForPackage(_package);
        _package.readme = marked(_package.readme);
        var data = {};
        data['package'] = _package;

        reply.view('package', helpers.toJSON(data));
      });
    }
  };

  render = {

    error: function error(req, reply) {

      var data = {
        error: 'fatal error'
      };
      reply.view('error', helpers.toJSON(data));
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
        helpers.renderListPage(0, req, reply);
      }
      else if (path.indexOf(config.page.url) !== -1) {
        var page = parseInt(path.replace(config.page.url, ''), 10);
        if (isNaN(page)) {
          // TODO: fix me: throw error or redirect to
          // index instead of rendering page 0
          helpers.renderListPage(0, req, reply);
        }
        else {
          helpers.renderListPage(page, req, reply);
        }
      }
      else if (path.split('/').length === 2) {
        // render the package view for urls like
        // http://localhost:8000/<you-pkg-name>
        helpers.renderPackagePage(req, reply);
      }
      else {
        // dont know what to do at this point!
        // just render whatever it is; as is.
        reply();
      }
    }
  };

  return render;
};
