var async     = require('async');
var Datastore = require('nedb');
var config    = require('../config');
var maxSearchResults = config.search.maxResults;
var maxPageResults = config.page.maxResults;
var projections = {
    name: 1
};
var sortKeys = {
    name: 1
};
var db = new Datastore({
    filename: __dirname + '/../' + config.nedb.name,
    autoload: true
});

db.count({}, function (err, count) {
	if (err) {
		throw err;
	}
	console.dir('docs count in the local store: ' + count);
});

module.exports = {

	update: function (packages) {
		async.mapSeries(packages, function (pkg, callback) {
			db.update({
                    name:pkg.name
                },
			pkg, 
			{
				multi:false,
				upsert: true
			}, 
			callback);	
		}, function (err, results) {
			if (err) {
				// throw error and let the dev know
				// that something is terribly wrong!
				console.dir(err);
				throw err;
			}
			console.log('inserted packages into the local nedb.');
		});
	},	

	search: function (key, callback) {
		var regex = new RegExp(key, "i");
		var query = { 
			$or: [
                {
					'name': regex 
				}, { 
					'maintainers.name': regex 
				}, { 
					'author.name': regex 
				}, { 
					'author.email': regex 
				}
            ]
		};
		db.find(query, projections)
        .limit(maxSearchResults)
        .exec(function (err, packages) {
			if (err) {
				return callback(err);
			}
			callback(null, packages);
		});
	},

    getPackages: function (page, callback) {
        db.find({})
        .sort(sortKeys)
        .skip(page * maxPageResults)
        .limit(maxPageResults)
        .exec(function (err, packages) {
            if (err) {
                return callback(err);
            }
            callback(null, packages);
        });
    }
};