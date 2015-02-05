'use strict';

var config = require('./config');

var buildDir = 'public/build/';

var bootstrapDir = 'node_modules/bootstrap/dist/';

var browserify = {
  bundle: {
    src: ['public/javascripts/index.js'],
    dest: config.build.js
  }
};

var cssFiles = {};
cssFiles[config.build.css] = [bootstrapDir + 'css/bootstrap.css', 'public/css/**/*.css']

var cssmin = {
  options: {
    report: 'gzip'
  },
  combine: {
    files: cssFiles
  }
};

var watch = {
  css: {
    files: ['public/css/**/**'],
    tasks: ['cssmin']
  },
  js: {
    files: ['public/javascripts/**/**'],
    tasks: ['browserify']
  }
};

// to copy over all the bootstrap fonts
// into the build directory.
var copy = {
  main: {
    files: [{
      expand: true,
      flatten: true,
      src: [bootstrapDir + 'fonts/*'],
      dest: config.build.dir
    }]
  }
};

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: watch,
    browserify: browserify,
    cssmin: cssmin,
    copy: copy
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('build', ['cssmin', 'browserify', 'copy']);
  grunt.registerTask('default', ['watch']);
};
