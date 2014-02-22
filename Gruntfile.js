/*jshint node: true */

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('./package.json'),
        browserify: {
            'examples/todomvc/js/bundle.js': ['examples/todomvc/tmp/app.js'],
            options: {
                alias: ['./index:react-typescript']
            }
        },
        
        clean : {
            tmp : './examples/todomvc/tmp',
            js: './examples/todomvc/js'
        },
        
        typescript: {
            app: {
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
         }
    });
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-clean');
        
    grunt.registerTask('todoMVC', ['clean:tmp','typescript', 'clean:js', 'browserify', 'clean:tmp']);
};