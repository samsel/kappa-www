'use strict';

var pkg = require('./package'),
    Negotiator = require('negotiator');

module.exports = {

    name: pkg.name,

    version: pkg.version,

    register: function (plugin, options, next) {
        var negotiator, assetPaths;

        assetPaths = ['javascripts', 
                        'css',
                        'templates'];

        plugin.route({
            method: 'GET',
            path: '/public/{path*}',
            vhost: options.vhost,
            handler: {
                directory: {
                    path: './public',
                    listing: false,
                    index: true
                }
            }
        });

        plugin.ext('onRequest', function(request, next) {
            negotiator = new Negotiator(request.raw.req);
            if (negotiator.mediaType() === 'text/html' && 
                assetPaths.indexOf(request.path.split('/')[1]) !== -1) {
                request.setUrl('/public/' + request.path);
            } 
            next();
        });

        plugin.ext('onPostHandler', function(request, next) {
            negotiator = new Negotiator(request.raw.req);
            if (negotiator.mediaType() === 'text/html') {
                next({
                    path: request.path,
                    output: request.response.output
                });
                return;
            }

            next();
        });             

        next();
    }
};