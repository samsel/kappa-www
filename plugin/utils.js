var Negotiator = require('negotiator'),
	path = require('path'),
	assetDir = 'app',
	assets = ['javascripts', 'css', 'templates'];

module.exports.isHtmlRequest = function (req) {
	var negotiator;
	req.locals = req.locals || {};

	if (!req.locals.hasOwnProperty('htmlRequest')) {
		negotiator = new Negotiator(req.raw.req);
		req.locals.htmlRequest = (negotiator.mediaType() === 'text/html');
	}

	return req.locals.htmlRequest;
};

module.exports.isAssetRequest = function (req) {
	req.locals = req.locals || {};

	if (!req.locals.hasOwnProperty('assetRequest')) {
		req.locals.assetRequest = false;
		for (var i = 0; (i < assets.length && !req.locals.assetRequest); i+=1) {
			req.locals.assetRequest = req.path.indexOf(assets[i] + '/') !== -1; 
		}
	}

	return req.locals.assetRequest;
};

module.exports.assestPathForPath = function (path) {
	return '/' + assetDir + '/' + path;
};

module.exports.assestRoute = (function () {
	return '/' + assetDir + '/{path*}';
}());

module.exports.assestPath = (function () {
	return './' + assetDir;
}());

module.exports.indexFile = 'index.html';

module.exports.viewPath = ('./' + assetDir);