var Negotiator = require('negotiator'),
	path = require('path'),
	config = require('./config');

'use strict';

var utils = {
	isHtmlRequest: function (req) {
		var negotiator = new Negotiator(req.raw.req);
		return (negotiator.mediaType() === 'text/html');
	},

	isAssetRequest: function (req) {
		return req.path.indexOf(config.assetDirectory + '/') !== -1;
	},

	isPlainResponse: function (req) {
		return (req.response.variety && req.response.variety === 'plain');
	}
};

module.exports.shouldRenderHtml = function (req) {
	return utils.isHtmlRequest(req) && 
			!utils.isAssetRequest(req);
};

module.exports.assestRoute = '/'  + config.assetDirectory + '/{path*}';
module.exports.assestPath  = './' + config.assetDirectory;
module.exports.layoutFile  = config.layoutFile;
module.exports.viewPath    = './' + config.assetDirectory + '/' + config.templateDirectory;