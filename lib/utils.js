var Negotiator = require('negotiator'),
	assetPaths = ['javascripts', 'css', 'templates'];

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
		for (var i = 0; (i < assetPaths.length && !req.locals.assetRequest); i+=1) {
			req.locals.assetRequest = req.path.indexOf(assetPaths[i] + '/') !== -1; 
		}
	}

	return req.locals.assetRequest;
};