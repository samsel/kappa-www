var config   = require('../config');
var store    = require('./store');
var utils    = require('./utils');
var marked   = require('marked');

'use strict';

module.exports = function (options, registry) {

	function renderListPage(page, req, reply) {
		registry.packages(page, function (packages) {
			reply.view('index', {
				title: options.title,
				searchUrl: config.search.url,
				enableSearch: config.search.enable,
				packages: packages,
				nextPage: page + 1
			});	
		});	
	}

	function renderPackagePage(req, reply) {
		registry.packageInfo(req.url.pathname.slice(1, req.url.pathname.length), function (_package) {
			_package.readme = marked(_package.readme);
			reply.view('package', {
				'title': options.title,
				'package': _package
			});	
		});	
	}

	function renderError(req, reply) {		
		reply.view('error', {
			title: options.title,
			error: 'fatal error'
		});
	}

	function render(req, reply) {
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
	}

	function renderSearch(req, reply) {
		store.search(utils.searchKeyFromRequest(req), function (err, packages) {
			if (err) {
				return reply({
					error: {
						message: err.message
					}
				});
			}

			reply(packages);
		});
	}	

	return {
		render: render,
		renderError: renderError,
		renderSearch: renderSearch
	};
};