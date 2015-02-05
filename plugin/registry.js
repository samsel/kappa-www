'use strict';

var npm = require('npm');
var path = require('path');
var _ = require('underscore');
var store = require('./store');
var utils = require('./utils');
var npmconf = require('npmconf');
var config = require('../config');
var Client = require('npm-registry-client');
var urlParser = require('github-url-from-git');

module.exports.start = function start(options, done) {

  var client = null;
  var syncURL = options.registry + config.registry.dumpURL;
  var cachePath = path.resolve(__dirname + '/../' + config.directory.cache);
  var urlParserConfig = {
    extraBaseUrls: options.gitDomain || config.defaultDomain
  };

  function addWebURLForPackage(pkg) {
    if (pkg.repository && pkg.repository.url) {
      pkg.repository.webURL = urlParser(pkg.repository.url, urlParserConfig);
    }

    return pkg;
  }

  function packages(page, next) {
    store.get(page, function(err, packages) {

      if (err) {
        throw err;
      }
      //TODO: make this a DB operation!
      packages.map(addWebURLForPackage);
      next(packages);
    });
  }

  function packageInfo(name, next) {
    client.get(options.registry + name,
      config.registry,
      function(err, data, raw, res) {
        if (err) {
          throw err;
        }
        next(addWebURLForPackage(data));
      });
  }

  function sync(next) {
    client.get(syncURL, config.registry, function(err, data) {

      if (err) {
        throw err;
      }

      // remove _id and _tag
      // from the response data
      delete data._id;
      delete data._etag;
      var packages = _.values(data);
      store.update(utils.packageCleaner(packages));

      if (typeof next === 'function') {
        next(packages);
      }
    });
  }

  function finish(packages) {
    // start to regularly sync the packages
    setInterval(sync, config.syncInterval);
    var publicAPI = {
      packageInfo: packageInfo,
      packages: packages
    };

    done(publicAPI);
  }

  npmconf.load({}, function(err, conf) {

    if (err) {
      throw err;
    }

    conf.set('cache', cachePath);
    conf.set('always-auth', false);
    conf.set('strict-ssl', false);

    client = new Client(conf);
    sync(finish);
  });
};
