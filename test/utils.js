'use strict';

var test = require('tape');
var Hapi = require('hapi');
var path = require('path');
var config = require('../config');
var Utils = require('../plugin/utils');

test('kappa-www Utils', function(t) {

  t.test('all methods should be know to test suite', function(t) {
    t.equal(Object.keys(Utils).length, 8);
    t.end();
  });

  t.test('assestRoute property', function(t) {
    t.equal(Utils.assestRoute, '/'  + config.directory.asset + '/{path*}');
    t.end();
  });

  t.test('assestPath property', function(t) {
    t.equal(Utils.assestPath, path.normalize(__dirname + '/../' + config.directory.asset));
    t.end();
  });

  t.test('layoutFile property', function(t) {
    t.equal(Utils.layoutFile, config.layoutFile);
    t.end();
  });

  t.test('viewPath property', function(t) {
    t.equal(Utils.viewPath, path.normalize(__dirname + '/../' + config.directory.asset + '/' + config.directory.template));
    t.end();
  });

  t.test('isSearchRequest method should return true for package search requests', function(t) {
    var req = {
      headers: {
        'x-requested-with': 'XMLHttpRequest'
      },
      method: 'GET',
      url: {
        pathname: config.search.url + 'some_package'
      }
    };
    t.equal(Utils.isSearchRequest(req), true);
    t.end();
  });

  t.test('isSearchRequest method should return false for package search requests that are not xhr', function(t) {
    var req = {
      headers: {},
      method: 'GET',
      url: {
        pathname: config.search.url + 'some_package'
      }
    };
    t.equal(Utils.isSearchRequest(req), false);
    t.end();
  });

  t.test('searchKeyFromRequest method should return the package name for the search url', function(t) {
    var req = {
      headers: {
        'x-requested-with': 'XMLHttpRequest'
      },
      method: 'GET',
      url: {
        pathname: config.search.url + 'some_package'
      }
    };
    t.equal(Utils.searchKeyFromRequest(req), 'some_package');
    t.end();
  });

  t.test('shouldRenderHtml method should return true for browser based requests that are not kappa-www web app resources paths', function(t) {
    var req = {
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.143 Safari/537.36'
      },
      method: 'GET',
      path: '/some_package',
      url: {
        pathname: '/some_package'
      }
    };
    t.equal(Utils.shouldRenderHtml(req), true);
    t.end();
  });

  t.test('shouldRenderHtml method should return false for browser based requests that are kappa-www web app resources paths', function(t) {
    var req = {
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.143 Safari/537.36'
      },
      method: 'GET',
      path: config.directory.asset + '/' + config.directory.template + '/some_template',
      url: {
        pathname: config.directory.asset + '/' + config.directory.template + '/some_template'
      }
    };
    t.equal(Utils.shouldRenderHtml(req), false);
    t.end();
  });

  t.test('shouldRenderHtml method should return false for requests from npm client', function(t) {
    var req = {
      headers: {
        'user-agent': 'npm/1.4.14 node/v0.10.29 darwin x64'
      },
      method: 'GET',
      path: '/some_package',
      url: {
        pathname: '/some_package'
      }
    };
    t.equal(Utils.shouldRenderHtml(req), false);
    t.end();
  });

  t.test('packageCleaner method should clean the input array and return only array of objects and remove _id for the objects', function(t) {
    var input = [{
      _id: '_id attr',
      another: 'attr'
    },
    'string element', 999];

    var output = Utils.packageCleaner(input);

    t.equal(Array.isArray(output), true);
    t.equal(output.length, 1);
    t.equal(output[0]._id, undefined);
    t.end();
  });

  t.test('packageCleaner method should clean the input array and return only array of objects with the whitelistedkeys', function(t) {
    var input = [{
      _id: '_id attr',
      another: 'attr',
      name: 'my pkg',
      description: '',
      maintainers: {},
      keywords: [],
      repository: {},
      author: {}
    }];

    var output = Utils.packageCleaner(input);

    t.equal(output[0].another, undefined);
    t.equal(Object.keys(output[0]).length, 6);
    t.end();
  });

});
