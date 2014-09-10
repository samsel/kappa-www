'use strict';

var _         = require('underscore');
var npm       = require('npm');
var Client    = require('npm-registry-client');
var urlParser = require('github-url-from-git');
var npmconf   = require('npmconf');
var path      = require('path');
var config    = require('../config');
var store     = require('./store');


var Registry = module.exports = function (options) {
	this._client = null;
	this._options = options;
	this._domain = options.gitDomain || 
					config.defaultDomain;
	this._syncURL = this._options.registry + 
					config.registry.dumpURL;
	this._cachePath = path.resolve(__dirname + 
							'/../' + 
							config.directory.cache);
};

Registry.prototype._sync = function (callback) {
	this._client.get(this._syncURL, 
				config.registry, 
				function (err, data, raw, res) {
					if (err) { throw err; }

                    // remove _id and _tag
                    // from the response data
                    delete data._id;
                    delete data._etag;

					var keys = Object.keys(data);
					var packages = _.values(_.pick(data, keys));
                    // TODO: deal with errors
                    // that get thrown because
                    // of uniqueKey constraints.
                    // do updates instead of save.
					store.save(packages);
					if (typeof callback === 'function') { callback(packages); }
				}
	); 
};

Registry.prototype.init = function (callback) {
	var self = this;
	npmconf.load({}, function (err, conf) {
		if (err) { throw err; }
		conf.set('cache', self._cachePath);
		conf.set('always-auth', false);
		conf.set('strict-ssl', false);

		self._client = new Client(conf);
		self._sync(function (packages) {
			callback();
		});
	});
};

Registry.prototype.packages = function (page, callback) {
	var start = page * config.page.maxResults,
		end = start + config.page.maxResults,
		self = this;

    // TODO: dont sync for every call
    // Load from DB and have a sync Interval
    // to regularly sync the packages
	this._sync(function (allPackages) {
		var packages = allPackages.slice(start, end);
		packages.map(function (_package) {
			if (_package.repository && _package.repository.url) {
				_package.repository.webURL = urlParser(_package.repository.url, {extraBaseUrls: [self._domain]});
			}
		});
		callback(packages);
	});
};

Registry.prototype.packageInfo = function (name, callback) {
	this._client.get(this._options.registry + name, 
		config.registry, 
		function (err, data, raw, res) {
			if (err) { throw err; }
			callback(data);
		}
	);
};