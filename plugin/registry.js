'use strict';

var _ = require('underscore'),
	npm = require('npm'),
	Registry = require('npm-registry-client'),
	gitURLParser = require('github-url-from-git'),
	npmconf = require('npmconf'),
	path = require('path'),
	config = require('../config'),
	options,
	client,
	connectionConfig = {
		timeout: 1000,
		staleOk: false
	};


function initLocalNPM() {
	npm.load({
		loaded: false,
		registry: options.registry
	}, 
	function (err) {
		if (err) {
			throw err;
		}

		npm.on("log", function (message) {
			console.log(message);
		});
	});
}

function sync(cb) {
	var uri = options.registry + "-/all",
		callback = function (err, data, raw, res) {
			if (err) { throw err; }
			if (typeof cb === 'function') { cb(data); }
		};
	client.get(uri, connectionConfig, callback); 
}

module.exports.setup = function (_options, callback) {
	options = _options;
	options.gitDomain = options.gitDomain || 'github.com';

	npmconf.load({}, function (err, conf) {
		if (err) {
			throw err;
		}
		conf.set('cache', path.resolve(__dirname + '/../' + config.directory.cache));
		conf.set('always-auth', false);
		conf.set('strict-ssl', false);

		client = new Registry(conf);
		//setInterval(sync, config.syncInterval);
		sync(function (packages) {
			callback();
		});

		initLocalNPM();
	});
};


module.exports.list = function (page, callback) {
	var start = page * config.page.maxResults,
		end = start + config.page.maxResults;

	sync(function (allPackages) {
		var keys = Object.keys(allPackages);
		keys = keys.splice(1, keys.length); //ignore the first key which is '_updated'

		var packages = _.values(_.pick(allPackages, keys.slice(start, end)));
		packages.map(function (_package) {
			_package.repository.webURL = gitURLParser(_package.repository.url, {extraBaseUrls: [options.gitDomain]});
		});
		callback(packages);
	});
};

module.exports.packageInfo = function (name, callback) {
	var uri = options.registry + name;

	client.get(uri, connectionConfig, function (err, data, raw, res) {
		if (err) {
			throw err;
		}

		callback(data);

	});
};