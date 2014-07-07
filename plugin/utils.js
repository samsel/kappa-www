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

module.exports.assestPathForPath = function (path) {
	return '/' + config.assetDirectory + '/' + path;
};

module.exports.assestRoute = (function () {
	return '/' + config.assetDirectory + '/{path*}';
}());

module.exports.assestPath = (function () {
	return './' + config.assetDirectory;
}());

module.exports.indexFile = config.indexFile;

module.exports.viewPath = ('./' + config.assetDirectory);