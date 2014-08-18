'use strict';

var  markdown = require('markdown').markdown,
	registry = require('./registry'),
	templater = require('./templater'),
	config = require('./config'),
    utils = require('./utils'),
    search, options,
    renderListPage, renderPackagePage;

renderListPage = function (page, req, reply) {
	registry.list(page, function (packages) {
		reply.view('index', {
			title: options.title,
			searchUrl: config.search.url,
			packages: packages,
			nextPage: page + 1
		});	
	});	
};

renderPackagePage = function (req, reply) {
	registry.packageInfo(req.url.pathname.slice(1, req.url.pathname.length), function (_package) {
		_package.readme = markdown.toHTML(_package.readme);
		reply.view('package', {
			title: options.title,
			'package': _package
		});	
	});	
};    

module.exports.engine = templater.engine;

module.exports.setup = function (_options, callback) {
	options = _options;
	search = require('./search')(_options);
	registry.setup(_options, callback);
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
	search(utils.searchKeyFromRequest(req), function (err, results) {
		reply({
			packages: results
		});
	});
};