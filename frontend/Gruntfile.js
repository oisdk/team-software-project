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
                files: [{
                        expand: true,
                        cwd: 'html',
                        src: ['**'],
                        dest: 'dist/'
                    },
                    {
                        expand: true,
                        cwd: 'assets',
                        src: ['**'],
                        dest: 'dist/'
                    }
                ]
            }
        },
        watch: {
            app: {
                files: ['app/**/!(*.test).js'],
                tasks: ['browserify', 'uglify']
            },
            assets: {
                files: ['html/**/*', 'assets/**/*'],
                tasks: ['copy']
            },
            css: {
                files: ['css/**/*'],
                tasks: ['cssmin']
            }
        }
    });
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('static', ['browserify', 'uglify', 'cssmin', 'copy']);
};
