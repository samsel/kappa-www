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

    // t.test('shouldRenderHtml method should return true for browser based requests that are not kappa-www web app resources paths' , function (t) {
    //     var req = {
    //         headers: {
    //             'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    //         },
    //         method: 'GET',
    //         url: {
    //             pathname: '/some_package'
    //         }
    //     };
    //     t.equal(Utils.shouldRenderHtml(req), true);
    //     t.end();
    // });                                     

});