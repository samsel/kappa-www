var Datastore = require('nedb');
var config = require('../config');
var db = new Datastore({ 
	filename: __dirname + '/../' + config.nedb.name, 
	autoload: true 
});
var maxSearchResults = config.search.maxResults;

module.exports = {
	save: function (packages) {
		
		var pp = [];

		for (var i = 0; i < packages.length - 21 ; i++) {
			var p = packages[i];
			console.dir(p);
			pp.push(p);
		}

		db.insert(pp, function (err, insertedPackages) {
			if (err) {
				// throw error and let the dev know
				// that something is terribly wrong!
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