'use strict';

var pkg = require('./package'),
    detector = require('./lib/detector');

var isWebRequest = {
    method: function(req, reply) {
        reply(detector.isBrowser(req));
    },
    assign: "isWebRequest"
};

var render = function (req, reply) {
    reply("yeah browser");
};

module.exports = {

    name: pkg.name,

    version: pkg.version,

    register: function (plugin, options, next) {

        plugin.expose({
            isWebRequest: isWebRequest,
            render: render
        }); 

        next();
    }
};