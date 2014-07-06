'use strict';

var pkg = require('./package'),
    utils = require('./lib/utils');

module.exports = {

    name: pkg.name,

    version: pkg.version,

    register: function (plugin, options, next) {

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

        plugin.ext('onRequest', function(req, next) {
            if (utils.isHtmlRequest(req) && utils.isAssetRequest(req)) {
                req.setUrl('/public/' + req.path);
            } 
            next();
        });

        plugin.ext('onPostHandler', function(req, reply) {
            if (utils.isHtmlRequest(req) && !utils.isAssetRequest(req)) {
                reply.file(__dirname + '/public/index.html');
                return;
            }

            reply();
        });             

        next();
    }
};

// reply({
//     path: request.path,
//     output: request.response.output
// });