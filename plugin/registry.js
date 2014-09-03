'use strict';

var _         = require('underscore');
var npm       = require('npm');
var Client    = require('npm-registry-client');
var urlParser = require('github-url-from-git');
var npmconf   = require('npmconf');
var path      = require('path');
var config    = require('../config');


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
					if (typeof callback === 'function') { callback(data); }
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

	this._sync(function (allPackages) {
		var keys = Object.keys(allPackages);
		//ignore the first key which is '_updated'
		keys = keys.splice(1, keys.length); 

		var packages = _.values(_.pick(allPackages, keys.slice(start, end)));
		packages.map(function (_package) {
			//_package.repository.webURL = urlParser(_package.repository.url, {extraBaseUrls: [self._domain]});
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