'use strict';

var buildDir = 'public/build/';

var browserify = {
  bundle: {
    src: ['public/javascripts/index.js'],
    dest: buildDir + 'app.js'
  }
};

var cssFiles = {};
cssFiles[buildDir + 'app.css'] = ['node_modules/bootstrap/dist/css/bootstrap.css', 'public/css/**/*.css']

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

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: watch,
    browserify: browserify,
    cssmin: cssmin
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('build', ['cssmin', 'browserify']);
  grunt.registerTask('default', ['watch']);
};
