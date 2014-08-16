var config = require('./config');

'use strict';

var utils = {
	isNonNPMClientBasedRequest: function (req) {
		return req.headers['user-agent'] &&
				req.headers['user-agent'].indexOf('npm/') === -1;
	},

	isXHRRequest: function (req) {
		return (req.headers['x-requested-with'] === 'XMLHttpRequest');
	},

	isAssetRequest: function (req) {
		return req.path.indexOf(config.directory.asset + '/') !== -1;
	},

	isPlainResponse: function (req) {
		return (req.response.variety && req.response.variety === 'plain');
	}
};

module.exports.shouldRenderHtml = function (req) {
	return utils.isNonNPMClientBasedRequest(req) && 
			!utils.isAssetRequest(req);
};

module.exports.isSearchRequest = function (req) {
	return utils.isXHRRequest(req) && 
			req.url.pathname.indexOf(config.search.url) !== -1;
};

module.exports.searchKeyFromRequest = function (req) {
	return req.url.pathname.split('/').pop();
};

module.exports.assestRoute = '/'  + config.directory.asset + '/{path*}';
module.exports.assestPath  = './' + config.directory.asset;
module.exports.layoutFile  = config.layoutFile;
module.exports.viewPath    = './' + config.directory.asset + '/' + config.directory.template;