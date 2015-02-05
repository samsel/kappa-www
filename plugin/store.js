'use strict';

var async   = require('async');
var Datastore = require('nedb');
var config    = require('../config');

var projections = {
  name: 1
};

var sortKeys = {
  name: 1
};

var updateOptions = {
  multi: false,
  upsert: true
};

var db = new Datastore({
  filename: __dirname + '/../' + config.nedb.name,
  autoload: true
});

db.count({}, function(err, count) {
  if (err) {
    throw err;
  }
  console.dir('docs count in the local store: ' + count);
});

function buildQuery(key) {
  var regex = new RegExp(key, 'i');
  return {
    $or: [{
      name: regex
    }, {
      'maintainers.name': regex
    }, {
      'author.name': regex
    }, {
      'author.email': regex
    }]
  };
}

module.exports = {

  update: function(packages) {

    function mapper(pkg, callback) {
      var update = {
        name: pkg.name
      };
      db.update(update, pkg, updateOptions, callback);
    }

    function done(err, results) {
      if (err) {
        // throw error and let the dev know
        // that something is terribly wrong!
        throw err;
      }
      console.log('inserted packages into the local nedb.');
    }

    async.mapSeries(packages, mapper, done);
  },

  search: function(key, callback) {
    db.find(buildQuery(key), projections)
      .limit(config.search.maxResults)
      .exec(callback);
  },

  get: function(page, callback) {
    db.find({})
      .sort(sortKeys)
      .skip(page * config.page.maxResults)
      .limit(config.page.maxResults)
      .exec(callback);
  }
};
