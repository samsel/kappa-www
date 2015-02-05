module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
		css: {
			files: ['public/css/**/**'],
			tasks: ['cssmin']
		},
		js: {
			files: ['public/javascripts/**/**'],
			tasks: ['requirejs']
		}
	},
	requirejs: {
		compile: {
			options: {
				baseUrl: 'public',
				mainConfigFile: 'public/javascripts/config.js',
				optimize: 'uglify',
				findNestedDependencies: true,
				name: 'javascripts/config',
				include: ['components/requirejs/require'],
				out: 'public/build/app.min.js'
			}
		}
	},
	cssmin: {
		options: {
			report: 'gzip'
		},
		combine: {
			files: {
				'public/build/app.min.css': ['public/components/bootstrap/dist/css/bootstrap.css', 'public/css/**/*.css']
			}
		}
	}
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // the default task can be run just by typing "grunt" on the command line
  grunt.registerTask('default', ['watch']);
};
