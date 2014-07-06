'use strict';

var pkg = require('../package'),
    utils = require('./utils');

module.exports = {

    name: pkg.name,

    version: pkg.version,

    register: function (plugin, options, next) {

        plugin.route({
            method: 'GET',
            path: utils.assestRoute,
            vhost: options.vhost,
            handler: {
                directory: {
                    path: utils.assestPath,
                    listing: false,
                    index: true
                }
            }
        });

        plugin.ext('onRequest', function(req, next) {
            if (utils.isHtmlRequest(req) && utils.isAssetRequest(req)) {
                req.setUrl(utils.assestPathForPath(req.path));
            } 
            next();
        });

        plugin.ext('onPostHandler', function(req, reply) {
            if (utils.isHtmlRequest(req) && !utils.isAssetRequest(req)) {
                reply.file(utils.indexFile);
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