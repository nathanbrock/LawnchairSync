module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'src/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> v<%= pkg.version %> */\n'
      },
      dist: {
        files: {
          'src/<%= pkg.name %>-<%= pkg.version %>.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jasmine: {
      dist: {
        src: 'src/<%= pkg.name %>.dev.js',
        options: {
          vendor: [
            'test/lib/jQuery/jquery-1.10.1.min.js',
            'test/lib/lawnchair/lawnchair-0.6.1.min.js'
          ],
          specs: 'test/spec/*Spec.js',
        }
      }
    },
    jshint: {
      files: ['gruntfile.js', 'src/**/*.dev.js', 'test/spec/*.js', 'examples/**/lib/*.js'],
      options: {
        // options here to override JSHint defaults
        smarttabs: true,
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    copy: {
      dist: {
        files: [{
          src: ['src/<%= pkg.name %>-<%= pkg.version %>.js'],
          dest: 'examples/github-stars/lib/'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('default', ['jshint', 'jasmine', 'concat', 'uglify', 'copy']);

};