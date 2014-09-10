var Datastore = require('nedb');
var config = require('../config');
var db = new Datastore({ 
	filename: __dirname + '/../' + config.nedb.name, 
	autoload: true 
});
var maxSearchResults = config.search.maxResults;

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
			$or: [{ 
					'name': regex 
				}, { 
					'maintainers.name': regex 
				}, { 
					'author.name': regex 
				}, { 
					'author.email': regex 
				}]
		};
		var projections = {
			name: 1
		};
		db.find(query, projections).limit(maxSearchResults).exec(function (err, packages) {
			if (err) {
				return callback(err);
			}
			callback(null, packages);
		});
	}
};