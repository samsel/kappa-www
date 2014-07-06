'use strict';

var pkg = require('./package'),
    Negotiator = require('negotiator');

module.exports = {

    name: pkg.name,

    version: pkg.version,

    register: function (plugin, options, next) {
        var negotiator;

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
            if (negotiator.mediaType() === 'text/html') {
                request.setUrl('/public/' + request.path);
            } 
            next();
        });       

        next();
    }
};