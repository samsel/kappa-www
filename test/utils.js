'use strict';

var test = require('tape');
var Utils = require('../plugin/utils');
var config = require('../plugin/config');
var Hapi = require('hapi');



test('kappa-www Utils', function (t) {

    t.test('all methods should be know to test suite', function (t) {
        t.equal(Object.keys(Utils).length, 7);
        t.end();
    });

    t.test('assestRoute property', function (t) {
        t.equal(Utils.assestRoute, '/'  + config.directory.asset + '/{path*}');
        t.end();
    });

    t.test('assestPath property', function (t) {
        t.equal(Utils.assestPath, './' + config.directory.asset);
        t.end();
    });

    t.test('layoutFile property', function (t) {
        t.equal(Utils.layoutFile, config.layoutFile);
        t.end();
    });

    t.test('viewPath property', function (t) {
        t.equal(Utils.viewPath, './' + config.directory.asset + '/' + config.directory.template);
        t.end();
    }); 

    t.test('isSearchRequest method should return true for package search requests', function (t) {
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

    t.test('isSearchRequest method should return false for package search requests that are not xhr', function (t) {
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

    t.test('searchKeyFromRequest method should return the package name for the search url', function (t) {
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

    t.test('shouldRenderHtml method should return true for browser based requests that are not kappa-www web app resources paths' , function (t) {
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

    t.test('shouldRenderHtml method should return false for browser based requests that are kappa-www web app resources paths' , function (t) {
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

    t.test('shouldRenderHtml method should return false for requests from npm client' , function (t) {
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

});