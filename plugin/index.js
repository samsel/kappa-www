'use strict';

var pkg = require('../package'),
    handlebars = require('handlebars'),
    utils = require('./utils');

handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
});    

module.exports = {

    name: pkg.name,

    version: pkg.version,

    register: function (plugin, options, next) {

        plugin.views({
            engines: {
                html: {
                    module: handlebars,
                    //layout: utils.layoutFile
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
                reply.view(utils.viewForStatus(req.response.output.statusCode), 
                    {
                        title: options.title,
                        data: req.response.output
                    });
                return;
            }

            reply();
        });             

        next();
    }
};