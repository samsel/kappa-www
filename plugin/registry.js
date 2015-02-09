'use strict';

var npm = require('npm');
var path = require('path');
var _ = require('underscore');
var log = require('./logger');
var store = require('./store');
var utils = require('./utils');
var npmconf = require('npmconf');
var config = require('../config');
var Client = require('npm-registry-client');

module.exports.start = function start(options, done) {

  var client;
  var syncURL = options.registry + config.registry.dumpURL;
  var cachePath = path.resolve(__dirname + '/../' + config.directory.cache);

  function packageInfo(name, next) {
    client.get(options.registry + name, config.registry, next);
  }

  function sync(next) {
    client.get(syncURL, config.registry, function(err, data) {

      if (err) {
        return next(err);
      }

      // remove _id and _tag
      // from the response data
      delete data._id;
      delete data._etag;
      var packages = _.values(data);
      packages = utils.packageCleaner(packages);

      store.update(packages, function update(err) {
        if (err) {
          return next(err);
        }
      });

      store.count(function(err, count) {
        if (err) {
          return next(err);
        }
      });

      if (typeof next === 'function') {
        next(null, packages);
      }
    });
  }

  function finish(err, packages) {

    if (err) {
      return done(err);
    }

    function syncWrap() {
      sync(function onSync(err) {
        // log the error informing
        // that syncs are failing.
        if (err) {
          log.info(err);
        }
      });
    }

    // start to regularly sync the packages
    setInterval(syncWrap, config.syncInterval);

    var publicAPI = {
      packageInfo: packageInfo
    };

    done(null, publicAPI);
  }

  function onNpmConfLoad(err, conf) {
    if (err) {
      return finish(err);
    }

    conf.set('cache', cachePath);
    conf.set('always-auth', false);
    conf.set('strict-ssl', false);

    client = new Client(conf);
    sync(finish);
  }

  npmconf.load({}, onNpmConfLoad);
};
