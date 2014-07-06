var UAParser = require('ua-parser-js'),
	parser = new UAParser(),
	supportedBrowsers = ['Chrome', 'IE', 'Firefox', 'Canary', 'Safari', 'Opera'];

module.exports.isBrowser = function (req) {
	var browser = parser.setUA(req.headers['user-agent']).getBrowser().name;
	return supportedBrowsers.indexOf(browser) !== -1;
};