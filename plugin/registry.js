var _ = require('underscore'),
	npm = require('../npm.json'),
	keys = Object.keys(npm),
	keys = keys.splice(1, keys.length), //ignore the first key which is '_updated'
	pageSize = 10;

module.exports.list = function (page) {
	var start = page * pageSize,
		end = start + pageSize;

	return _.values(_.pick(npm, keys.slice(start, end)));
};