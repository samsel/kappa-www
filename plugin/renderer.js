'use strict';

var registry = require('./registry'),
    utils = require('./utils'),
    locals = {};


module.exports.setLocals = function render(data) {
	locals.title = data.title;
};


module.exports.render = function render(req, reply) {

	if (req.response && req.response.isBoom) {
		data.title = locals.title;
		reply.view('error', {
			error: 'fatal error'
		});

		return;
	}

	if (req.url.pathname === '/') {
		var page = parseInt(req.query.page || 0);
		reply.view('index', {
			title: locals.title,
			packages: registry.list(page),
			nextPage: page + 1
		});	

		return;
	}
	
	reply.view('package', {
		title: locals.title,
		packageInfo: registry.packageInfo()
	});	

};