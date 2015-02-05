#!/usr/bin/env node

var rimraf = require('rimraf');
var config = require('../config');
var argv = require('minimist')(process.argv.slice(2));

if (!argv._.length || argv._[0] !== 'clean') {
  console.log('	USAGE: kappa-www clean');
}
else {
  console.log('*-                                   -*');
  console.log('pwd: ' + __dirname);
  // delete the nedb data store
  // *-
  //   This is CLI script - so sync APIs
  //   are good to use
  // -*
  console.log('   deleting the nedb data store file: ' + config.nedb.name);
  rimraf.sync(__dirname + '/../' + config.nedb.name);

  // delete the npm registry
  // client's cache folder
  console.log('   deleting the npm client cache folder: ' + config.directory.cache);
  rimraf.sync(__dirname + '/../' + config.directory.cache);

  console.log('*- done executing kappa-www clean task -*');
}
