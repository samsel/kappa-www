var Negotiator = require('negotiator'),
	path = require('path'),
	config = require('./config');

'use strict';	

module.exports.setLocals = function (req) {
	var negotiator = new Negotiator(req.raw.req);
	req.locals = req.locals || {};
	req.locals.htmlRequest = (negotiator.mediaType() === 'text/html');
	req.locals.assetRequest = req.path.indexOf(config.assetDirectory + '/') !== -1;
};

module.exports.shouldRenderHtml = function (req) {
	return req.locals.htmlRequest && 
			!req.locals.assetRequest;
};

module.exports.viewForStatus = function (statusCode) {
	return config.views[statusCode + ''] || config.views['500'];	
};

module.exports.assestRoute = '/'  + config.assetDirectory + '/{path*}';
module.exports.assestPath  = './' + config.assetDirectory;
module.exports.viewPath    = './' + config.assetDirectory + '/' + config.templateDirectory;