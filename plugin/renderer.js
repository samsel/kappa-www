var config = require('../config');
var store  = require('./store');
var utils  = require('./utils');
var marked = require('marked');
var _      = require('underscore');

'use strict';

module.exports = function (options, registry) {

	var defaults = {
		assetPath: {
			css   : '/public/build/app.min.css',
			js    : '/public/build/app.min.js',
			title : options.title 
		}
	};

	function renderListPage(page, req, reply) {
		registry.packages(page, function (packages) {
			reply.view('index', _.extend({
				searchUrl: config.search.url,
				enableSearch: config.search.enable,
				packages: packages,
				nextPage: page + 1
			}, defaults));	
		});	
	}

	function renderPackagePage(req, reply) {
		registry.packageInfo(req.url.pathname.slice(1, req.url.pathname.length), function (_package) {
			_package.readme = marked(_package.readme);
			reply.view('package', _.extend({
				'package': _package
			}, defaults));	
		});	
	}

	function renderError(req, reply) {		
		reply.view('error', _.extend({
			error: 'fatal error'
		}, defaults));
	}

	function render(req, reply) {
		var path = req.url.pathname;
		if (path.length > 1 && path.charAt(path.length - 1) === '/') {
			// remove the trailing '/' - if any from the path
			path = path.substring(0, path.length - 1);
		}

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
		else if (path.split('/').length === 2) {
			// render the package view for urls like
			// http://localhost:8000/<you-pkg-name>
			renderPackagePage(req, reply);
		}
		else {
			// dont know what to do at this point!
			// just render whatever it is; as is.
			reply();
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