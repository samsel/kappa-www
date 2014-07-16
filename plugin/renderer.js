'use strict';

var registry = require('./registry'),
	config = require('./config'),
    utils = require('./utils'),
    options;


module.exports.setup = function (_options, callback) {
	options = _options;
	registry.setup(_options, callback);
};

module.exports.renderError = function (req, reply) {		
	reply.view('error', {
		title: options.title,
		error: 'fatal error'
	});
};


module.exports.render = function (req, reply) {

	if (req.url.pathname === '/') {
		var page = parseInt(req.query.page || 0);
		registry.list(page, function (packages) {
			reply.view('index', {
				title: options.title,
				searchUrl: config.searchUrl,
				packages: packages,
				nextPage: page + 1
			});	
		});

		return;
	}

	registry.packageInfo(req.url.pathname.slice(1, req.url.pathname.length), function (info) {
		reply.view('package', {
			title: options.title,
			packageInfo: info
		});	
	});	

};

module.exports.search = function (req, reply) {
	registry.search(utils.searchKeyFromRequest(req), function (packages) {
		reply({
			packages: packages
		});
	});
};