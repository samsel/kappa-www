var Negotiator = require('negotiator'),
	config = require('./config');

'use strict';

var utils = {
	isHtmlRequest: function (req) {
		var negotiator = new Negotiator(req.raw.req);
		return (negotiator.mediaType() === 'text/html');
	},

	isAssetRequest: function (req) {
		return req.path.indexOf(config.directory.asset + '/') !== -1;
	},

	isPlainResponse: function (req) {
		return (req.response.variety && req.response.variety === 'plain');
	}
};

module.exports.shouldRenderHtml = function (req) {
	return utils.isHtmlRequest(req) && 
			!utils.isAssetRequest(req);
};

module.exports.assestRoute = '/'  + config.directory.asset + '/{path*}';
module.exports.assestPath  = './' + config.directory.asset;
module.exports.layoutFile  = config.layoutFile;
module.exports.viewPath    = './' + config.directory.asset + '/' + config.directory.template;