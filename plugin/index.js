'use strict';

var pkg = require('../package'),
    handlebars = require('handlebars'),
    utils = require('./utils');

module.exports = {

    name: pkg.name,

    version: pkg.version,

    register: function (plugin, options, next) {

        plugin.views({
            engines: {
                html: {
                    module: handlebars
                }
            },
            path: utils.viewPath
        });        

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
                reply.view(utils.indexFile, {
                    path: req.path,
                    data: req.response.output
                });
                return;
            }

            reply();
        });             

        next();
    }
};