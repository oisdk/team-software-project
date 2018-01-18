module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dist: {
        src: ['app/index.js'],
        dest: 'dist/bundle.js',
        options: {
          transform: ['babelify']
        }
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/bundle.js': ['<%= browserify.dist.dest %>']
        }
      }
    },
    cssmin: {
      target: {
        files: {
          'dist/styles.css': ['css/*.css']
        }
      }
    },
    copy: {
      main: {
        files: [
          {src: ['html/**'], dest: 'dist/'},
          {src: ['assets/**'], dest: 'dist/'}
        ]
      }
    }
  });
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('static', ['browserify', 'uglify', 'cssmin', 'copy']);
};
