'use strict';

var bunyan = require('bunyan');

var config = {
  name: require('../package').name
};

module.exports = bunyan.createLogger(config);
