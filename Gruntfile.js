/*jshint node: true */

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('./package.json'),
        browserify: {
            todomvc: {
                src: 'examples/todomvc/tmp/app.js',
                dest: 'examples/todomvc/js/bundle.js',
                options: {
                    alias: ['./index:react-typescript']
                }
            },
            twoWayBinding: {
                src: 'examples/twoWayBinding/tmp/index.js',
                dest: 'examples/twoWayBinding/js/bundle.js',
                options: {
                    alias: ['./index:react-typescript']
                }
            }
        },
        
        clean : {
            todomvc : './examples/todomvc/tmp',
            twoWayBinding : './examples/twoWayBinding/tmp'
        },
        
        typescript: {
            todomvc: {
                src: ['declarations/*.d.ts','examples/todomvc/src/**/*.ts'],
                dest: 'examples/todomvc/tmp',
                options: {
                    base_path : 'examples/todomvc/src/',
                    module : 'commonjs',
                    target: 'es5',
                    sourcemap: false,
                    comments : true,
                    noImplicitAny: true,
                    ignoreTypeCheck: false
                }
            },
            twoWayBinding: {
                src: ['declarations/*.d.ts','examples/twoWayBinding/src/**/*.ts'],
                dest: 'examples/twoWayBinding/tmp',
                options: {
                    base_path : 'examples/twoWayBinding/src/',
                    module : 'commonjs',
                    target: 'es5',
                    sourcemap: false,
                    comments : true,
                    noImplicitAny: true,
                    ignoreTypeCheck: false
                }
            },
         }
    });
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-clean');
        
    grunt.registerTask('todoMVC', ['clean:todomvc','typescript:todomvc', 'browserify:todomvc', 'clean:todomvc']);
    grunt.registerTask('twoWayBinding', ['clean:twoWayBinding','typescript:twoWayBinding', 'browserify:twoWayBinding', 'clean:twoWayBinding']);
};