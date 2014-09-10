'use strict';

module.exports = function(grunt) {

    // This automatically loads grunt tasks from node_modules
    require('load-grunt-tasks')(grunt);
    // This installs timers so you can monitor how log each step takes
    require('time-grunt')(grunt);

    // All the project JS files
    var jsFiles = [
        'Gruntfile.js',
        'test/**/*.js',
        'examples/**/*.js',
        'src/**/*.js',
        'index.js',
    ];

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // grunt-contrib-jshint
        jshint: {
            all: {
                // Monitors all files except for vendor code
                src: jsFiles,
            },
            options: {
                jshintrc: './.jshintrc',
            },
        },
        jscs: {
            all: {
                src: jsFiles,
                options: {
                    config: './.jscsrc',
                },
            },
        },
        // grunt-contrib-watch
        watch: {
            lint: {
                files: jsFiles,
                // grunt-newer is also included.
                // It will dynamically modify the jshint
                // config so only files that changed will be linted
                tasks: ['newer:jshint:all'],
            },
            style: {
                files: jsFiles,
                // grunt-newer is also included.
                // It will dynamically modify the jscs
                // config so only files that changed will be linted
                tasks: ['newer:jscs:all'],
            },
            browserifyMain: {
                // only rebuild when our core when our app changes
                files: ['src/**/*.js'],
                tasks: [
                    'browserify:main',
                    'browserify:mainMin',
                    'newer:jshint:all'
                ],
            },
            concat: {
                // automatically reconcatenate
                files: ['tmp/*browserify.js'],
                tasks: ['concat']
            },
            livereload: {
                // reload our testing page
                files: ['public/**/*'],
                options: {
                    livereload: true
                },
            },
        },
        // grunt-browserify
        browserify: {
            // The main browserify build
            main: {
                files: {
                    // Build from the main entry point into a temp folder
                    'dist/main.browserify.js': ['src/browser.js']
                },
                options: {
                    browserifyOptions: {
                        standalone: 'oadaIdClient'
                    },
                    external: [
                    ],
                },
            },
            // The minified main browserify build
            mainMin: {
                files: {
                    // Build from the main entry point into a temp folder
                    'dist/main.browserify.min.js': ['src/browser.js']
                },
                options: {
                    transform: [['uglifyify', {global: true}]],
                    browserifyOptions: {
                        standalone: 'oadaIdClient'
                    },
                    external: [
                    ],
                },
            },
        },
        // grunt-contrib-connect
        // A really simple static web server that supports live-reload
        connect: {
            dev: {
                options: {
                    port: grunt.option('port') || 8000,
                    base: ['./dist/', './examples/browser-client/'],
                    livereload: true
                }
            }
        }
    });

    // Default task.    Build, start the server, and watch files for changes
    grunt.registerTask('default', ['build', 'connect', 'watch']);
    // Build task.    Compile templates, browserify, and concat
    grunt.registerTask('build', ['lint', 'style', 'browserify']);

    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('style', ['jscs']);

};