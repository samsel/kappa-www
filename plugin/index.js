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
            utils.setLocals(req);
            next();
        });

        plugin.ext('onPostHandler', function(req, reply) {
            if (utils.shouldRenderHtml(req)) {
                reply.view(utils.viewForStatus(req.response.output.statusCode), {
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