/*global module:false*/
/*module.exports = function (grunt) {

 // Project configuration.
 grunt.initConfig({
 // Metadata.
 pkg: grunt.file.readJSON('package.json'),
 banner: '/!*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
 '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
 '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
 '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
 ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> *!/\n',
 // Task configuration.
 concat: {
 options: {
 banner: '<%= banner %>',
 stripBanners: true
 },
 dist: {
 src: ['lib/<%= pkg.name %>.js'],
 dest: 'dist/<%= pkg.name %>.js'
 }
 },
 uglify: {
 options: {
 banner: '<%= banner %>'
 },
 dist: {
 src: '<%= concat.dist.dest %>',
 dest: 'dist/<%= pkg.name %>.min.js'
 }
 },
 jshint: {
 options: {
 curly: true,
 eqeqeq: true,
 immed: true,
 latedef: true,
 newcap: true,
 noarg: true,
 sub: true,
 undef: true,
 unused: true,
 boss: true,
 eqnull: true,
 browser: true,
 globals: {
 jQuery: true
 }
 },
 gruntfile: {
 src: 'Gruntfile.js'
 },
 lib_test: {
 src: ['lib/!**!/!*.js', 'test/!**!/!*.js']
 }
 },
 qunit: {
 files: ['test/!**!/!*.html']
 },
 watch: {
 gruntfile: {
 files: '<%= jshint.gruntfile.src %>',
 tasks: ['jshint:gruntfile']
 },
 lib_test: {
 files: '<%= jshint.lib_test.src %>',
 tasks: ['jshint:lib_test', 'qunit']
 },
 sass: {
 files: 'app/scss/!**!/!*.scss',
 tasks: ['sass']
 }
 }
 });

 // These plugins provide necessary tasks.
 grunt.loadNpmTasks('grunt-contrib-concat');
 grunt.loadNpmTasks('grunt-contrib-uglify');
 grunt.loadNpmTasks('grunt-contrib-qunit');
 grunt.loadNpmTasks('grunt-contrib-jshint');
 grunt.loadNpmTasks('grunt-contrib-watch');

 // Default task.
 grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);*/
// };
// This shows a full config file!
module.exports = function (grunt) {
    grunt.initConfig({
        watch: {
            files: 'app/scss/**/*.scss',
            tasks: ['sass']
        },
        sass: {
            dev: {
                files: {
                    'app/css/main.css': 'app/scss/main.scss'
                }
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        'app/scss/*.css',
                        'app/*.html',
                        'app/js/*.js'
                    ]
                },
                options: {
                    watchTask: true,
                    server: './app'
                }
            }
        }
    });

    // load npm tasks
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');

    // define default task
    grunt.registerTask('default', ['browserSync', 'watch']);
};


