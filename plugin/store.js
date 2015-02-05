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

  count: function count(callback) {
    db.count({}, callback);
  },

  update: function update(packages, callback) {

    function mapper(pkg, next) {
      var update = {
        name: pkg.name
      };
      db.update(update, pkg, updateOptions, next);
    }

    async.mapSeries(packages, mapper, callback);
  },

  search: function search(key, callback) {
    db.find(buildQuery(key), projections)
      .limit(config.search.maxResults)
      .exec(callback);
  },

  get: function get(page, callback) {
    db.find({})
      .sort(sortKeys)
      .skip(page * config.page.maxResults)
      .limit(config.page.maxResults)
      .exec(callback);
  }
};
