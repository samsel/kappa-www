'use strict';

var utils    = require('./utils');
var config   = require('../config');
var Registry = require('./registry');
var markdown = require('markdown').markdown;

var options;
var registry;
var renderListPage; 
var renderPackagePage;

renderListPage = function (page, req, reply) {
	registry.packages(page, function (packages) {
		reply.view('index', {
			title: options.title,
			searchUrl: config.search.url,
			enableSearch: config.search.enable,
			packages: packages,
			nextPage: page + 1
		});	
	});	
};

renderPackagePage = function (req, reply) {
	registry.packageInfo(req.url.pathname.slice(1, req.url.pathname.length), function (_package) {
		_package.readme = markdown.toHTML(_package.readme);
		reply.view('package', {
			'title': options.title,
			'package': _package
		});	
	});	
};

module.exports.setup = function (_options, callback) {
	options = _options;
	registry = new Registry(_options);
	registry.init(callback);
};

module.exports.renderError = function (req, reply) {		
	reply.view('error', {
		title: options.title,
		error: 'fatal error'
	});
};

module.exports.render = function (req, reply) {
	var path = req.url.pathname; 

	if (path === '/') {
		renderListPage(0, req, reply);
	}
	else if (path.indexOf(config.page.url) !== -1) {
		var page = parseInt(path.replace(config.page.url, ''), 10);
		if (isNaN(page)) {
			// TODO: fix me: throw error or redirect to 
			// index instead of rendering page 0
			renderListPage(0, req, reply);
		}
		else {
			renderListPage(page, req, reply);
		}
	}
	else {
		renderPackagePage(req, reply);
	}
};

module.exports.search = function (req, reply) {
	// search(utils.searchKeyFromRequest(req), function (err, results) {
	// 	reply({
	// 		packages: results
	// 	});
	// });
};