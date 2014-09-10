var Datastore = require('nedb');
var config = require('../config');
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

module.exports = {
	save: function (packages) {
		db.insert(packages, function (err, insertedPackages) {
			if (err) {
				// throw error and let the dev know
				// that something is terribly wrong!
                console.dir(err);
				throw err;
			}
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