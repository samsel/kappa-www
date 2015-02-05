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

function Registry(options) {
  this._client = null;
  this._options = options;
  this._syncURL = this._options.registry + config.registry.dumpURL;
  this._cachePath = path.resolve(__dirname + '/../' + config.directory.cache);
  this._urlParserConfig = {
    extraBaseUrls: options.gitDomain || config.defaultDomain
  };
}

Registry.prototype._sync = function(callback) {
  this._client.get(this._syncURL, config.registry, function(err, data) {
    if (err) {
      throw err;
    }
    // remove _id and _tag
    // from the response data
    delete data._id;
    delete data._etag;
    var packages = _.values(data);
    store.update(utils.packageCleaner(packages));
    if (typeof callback === 'function') {
      callback(packages);
    }
  });
};

Registry.prototype.init = function(callback) {
  var _this = this;
  npmconf.load({}, function(err, conf) {
    if (err) {
      throw err;
    }
    conf.set('cache', _this._cachePath);
    conf.set('always-auth', false);
    conf.set('strict-ssl', false);

    _this._client = new Client(conf);
    _this._sync(function(packages) {
      // start to regularly sync the packages
      setInterval(_this._sync.bind(_this), config.syncInterval);
      callback();
    });
  });
};

Registry.prototype.packages = function(page, callback) {
  var _this = this;
  store.getPackages(page, function(err, packages) {
    if (err) {
      throw err;
    }
    //TODO: make this a DB operation!
    packages.map(_this._addWebURLForPackage, _this);
    callback(packages);
  });
};

Registry.prototype.packageInfo = function(name, callback) {
  var _this = this;
  this._client.get(this._options.registry + name,
    config.registry,
    function(err, data, raw, res) {
    if (err) {
      throw err;
    }
    callback(_this._addWebURLForPackage(data));
  });
};

Registry.prototype._addWebURLForPackage = function(pkg) {
  if (pkg.repository && pkg.repository.url) {
    pkg.repository.webURL = urlParser(pkg.repository.url, this._urlParserConfig);
  }

  return pkg;
};

module.exports = Registry;
