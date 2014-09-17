'use strict';

var _         = require('underscore');
var npm       = require('npm');
var Client    = require('npm-registry-client');
var urlParser = require('github-url-from-git');
var npmconf   = require('npmconf');
var path      = require('path');
var config    = require('../config');
var store     = require('./store');
var utils      = require('./utils');

var Registry = module.exports = function (options) {
	this._client = null;
	this._options = options;
	this._syncURL = this._options.registry + 
					config.registry.dumpURL;
	this._cachePath = path.resolve(__dirname + 
							'/../' + 
							config.directory.cache);
	this._urlParserConfig = {
		extraBaseUrls: options.gitDomain || config.defaultDomain
	};
};

Registry.prototype._sync = function (callback) {
	this._client.get(this._syncURL, 
				config.registry, 
				function (err, data) {
					if (err) { throw err; }

                    // remove _id and _tag
                    // from the response data
                    delete data._id;
                    delete data._etag;

					var packages = _.values(data);
                    store.update(utils.packageCleaner(packages));

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
			// start to regularly sync the packages
            setInterval(self._sync.bind(self), config.syncInterval);
            return callback();
		});
	});
};

Registry.prototype.packages = function (page, callback) {
	var self = this;
    store.getPackages(page, function (err, packages) {
        if (err) {
            throw err;
        }
        //TODO: make this a DB operation!
        packages.map(self._addWebURLForPackage, self);
        callback(packages);
    });
};

Registry.prototype.packageInfo = function (name, callback) {
	var self = this;
	this._client.get(this._options.registry + name, 
		config.registry, 
		function (err, data, raw, res) {
			if (err) { throw err; }
			callback(self._addWebURLForPackage(data));
		}
	);
};

Registry.prototype._addWebURLForPackage = function (pkg) {
	if (pkg.repository && pkg.repository.url) {
		pkg.repository.webURL = urlParser(pkg.repository.url, this._urlParserConfig);
	}

	return pkg;
};