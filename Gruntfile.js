module.exports = function (grunt) {

  'use strict';

  // Load Grunt tasks declared in the package.json file
  require('load-grunt-tasks')(grunt);


  // Project settings
  var config = {
    
    // Folders for assets, development environment and production environment
    folder_local: 'dev',
    folder_public: 'dist',
    folder_assets: 'assets',

    // Server info
    //server_hostname: 'localhost',
    //server_port: 1337

  };


  // Configure Grunt 
  grunt.initConfig({

    // Project settings
    config: config,


    /* ====================================================================================== */
    /* Development tasks                                                                      */
    /* ====================================================================================== */


    // grunt-watch monitors the projects files and execute actions when a file changes
    watch: {
      options: {
        livereload: true
      },
      css: {
          files: ['<%= config.folder_local %>/css/styles.css']
      },
      js: {
          files: ['<%= config.folder_local %>/js/**.*']
      },
      views: {
          files: ['<%= config.folder_local %>/*.html']
      },
      images: {
        files: '<%= config.folder_assets %>/images/*.*',
        tasks: ['copy:dev']
      },
      icons: {
        files: '<%= config.folder_assets %>/icon-library/*.*',
        tasks: ['webfont']
      }
    },


    // Create an icon font from SVG files insode /icons folder
    webfont: {
      icons: {
        src: '<%= config.folder_assets %>/icon-library/*.svg',
        dest: '<%= config.folder_local %>/fonts',
        destCss: '<%= config.folder_assets %>/styles/libs/iconfont',
        options: {
          font: 'icon-font',
          hashes: false,
          engine: 'node',
          stylesheet: 'scss',
          relativeFontPath: '../fonts/',
          // syntax: 'bootstrap',
          htmlDemo: false,
          skip: false, // Set this variable to false to create the icon font. If /icons folder is empty, leave this variable as is
          templateOptions: {
            baseClass: 'doppler-icon',
            classPrefix: 'icon-'
          }
        }    
      }
    },


    // grunt-open will open your browser at the project's URL
    open: {
      source: {
        path: 'http://localhost'
      }
    },


    // Copy only the needed resources from Bower
    bowercopy: {
      options: {
        // Bower components folder will be removed afterwards
        clean: true
      },

      dev: {
        files: {
          '<%= config.folder_assets %>/styles/libs/normalize': 'normalize.scss',
          '<%= config.folder_assets %>/styles/libs/jeet': 'jeet.gs/scss/jeet',
          
        }
      }

     
    },


    // Every time an image gets updated or a new image is saved in the images folder, Grunt will copy all the images to the source folder
    copy: {
      dev: {
        expand: true,
        cwd: '<%= config.folder_assets %>/images',
        src: '**',
        dest: '<%= config.folder_local %>/img',
        filter: 'isFile',
      },
      dist: {
        expand: true,
        cwd: '<%= config.folder_local %>/',
        src: '**',
        dest: '<%= config.folder_public %>/',
        filter: 'isFile',
      },
      replacements: {
        expand: true,
        cwd: '<%= config.folder_assets %>/images',
        src    : [
          'aboutus_2011.jpg',
          'aboutus_2009.jpg',
          'aboutus_2007.jpg',
          'home_our_story_bg.jpg'
        ],
        dest: '<%= config.folder_public %>/img'
      }
    },


    // Execute concurrent tasks in Grunt
    concurrent: {
      watch: {
        tasks: [
          'watch', // Watch if files change
          'shell:sass_watch', // Run console command to compile Sass
          'open' // Open the server URL in a browser
        ],
        options: {
          logConcurrentOutput: true, 
          limit: 6 // Limit the cores usage to 4
        }
      }
    },


    // Run shell commands as a Grunt task
    shell: {
      // Run Sass compiling with watch, compass and sourcemap flags
      sass_compile: {
        command: 'sass --compass --sourcemap ' + '<%= config.folder_assets %>/styles/styles.scss:<%= config.folder_local %>/css/styles.css'
      },
      sass_watch: {
        command: 'sass --watch --compass --sourcemap ' + '<%= config.folder_assets %>/styles/styles.scss:<%= config.folder_local %>/css/styles.css'
      }
    },


    clean: {
      dist: {
        src: [
          '<%= config.folder_public %>/.htaccess', 
          '<%= config.folder_public %>/css/*.map', 
          '<%= config.folder_public %>/js/vendor/**.*', 
        ]
      }
    },




    // /* ====================================================================================== */
    // /* Production tasks                                                                       */
    // /* ====================================================================================== */


    useminPrepare: {
      options: {
        dest: '<%= config.folder_public %>'
      },
      html: '<%= config.folder_local %>/{,*/}*.html'
    },

    usemin: {
      html: ['<%= config.folder_local %>/{,*/}*.html']
    },

    concat: { 
      generated: { 
        files: [ 
          { // Plugins
            dest: '<%= config.folder_local %>/js/plugins.js', 
            src: '<%= config.folder_local %>/js/plugins/{,*/}*'
          }
        ] 
      } 
    },

    // Compress images
    imagemin: {
      png: {
        options: {
          optimizationLevel: 7
        },
        files: [
          {
            // Set to true to enable the following options…
            expand: true,
            // cwd is 'current working directory'
            cwd: '<%= config.folder_local %>/img/',
            src: ['**/*.png'],
            // Could also match cwd line above. i.e. project-directory/img/
            dest: '<%= config.folder_local %>/img/',
            ext: '.png'
          }
        ]
      },
      jpg: {
        options: {
          progressive: true,
          optimizationLevel: 7
        },
        files: [
          {
            // Set to true to enable the following options…
            expand: true,
            // cwd is 'current working directory'
            cwd: '<%= config.folder_local %>/img/',
            src: ['**/*.jpg'],
            // Could also match cwd. i.e. project-directory/img/
            dest: '<%= config.folder_local %>/img/',
            ext: '.jpg'
          }
        ]
      }
    },


    tinypng: {
      options: {
          apiKey: "U2epucPJFOx5xv_KvNmMavuANnEBDIUE",
          checkSigs: true,
          sigFile: 'dest/file_sigs.json',
          summarize: true,
          showProgress: true,
          stopOnImageError: true
      },
      jpg: {
        // Set to true to enable the following options…
          expand: true,
          // cwd is 'current working directory'
          cwd: '<%= config.folder_public %>/img/',
          src: ['**/*.jpg'],
          // Could also match cwd. i.e. project-directory/img/
          dest: '<%= config.folder_public %>/img/'
      },
      png: {
          // Set to true to enable the following options…
          expand: true,
          // cwd is 'current working directory'
          cwd: '<%= config.folder_public %>/img/',
          src: ['**/*.png'],
          // Could also match cwd line above. i.e. project-directory/img/
          dest: '<%= config.folder_public %>/img/'
      }
    },


    kraken: {
      options: {
        key: 'b87e244345e0334cdfdcb06151d0736e',
        secret: '7c5349c43fac3efa4256014de693b2aa7ee96885',
        lossy: true
      },
      dynamic: {
        files: [{
            expand: true,
            cwd: '<%= config.folder_public %>/img/',
            src: ['**/*.{png,jpg,jpeg,gif}'],
            dest: '<%= config.folder_public %>/img/'
        }]
      }
    },


    // Minify SVG files
    svgmin: {  
      options: {  
        plugins: [{
            removeViewBox: false
        }, {
            removeUselessStrokeAndFill: false
        }, {
            convertPathData: { 
                straightCurves: false
            }
        }]
      },
      dist: { 
        files: [{ 
            expand: true,             // Enable dynamic expansion.
            cwd: '<%= config.folder_public %>/img',     // Src matches are relative to this path.
            src: ['**/*.svg'],        // Actual pattern(s) to match.
            dest: '<%= config.folder_public %>/img',    // Destination path prefix.
            ext: '.svg'               // Dest filepaths will have this extension.
        }]
      }
    },


    // Minify/Uglify JS files
    uglify: {
      js: {
        options: {
          beautify: {
            width: 80,
            beautify: false
          }
        },
        files: [{
          expand: true,
          cwd: '<%= config.folder_public %>/js',
          src: '**/*.js',
          dest: '<%= config.folder_public %>/js'
        }]
      }
    },


    // Minify CSS for source/production release
    cssmin: {
      minify: {
        expand: true,
        cwd: '<%= config.folder_public %>/css/',
        src: ['*.css'],
        dest: '<%= config.folder_public %>/css/',
        ext: '.css'
      }
    },


    ftpush: {
      prod: {
        auth: {
          host: '192.168.170.22',
          port: 22,
          authKey: 'production'
        },
        src: '<%= config.folder_local %>',
        dest: '/',
        exclusions: ['<%= config.folder_local %>/**/.map', '<%= config.folder_local %>/**/Thumbs.db', 'dist/tmp'],
        simple: false,
        useList: false
      }
    },

    
  });

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-webfont');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-ftpush');
    grunt.loadNpmTasks('grunt-contrib-kraken');
    grunt.loadNpmTasks('grunt-contrib-cssmin');



  /* ====================================================================================== */
  /* Tasks @registration                                                                    */
  /* ====================================================================================== */

  // grunt.registerTask('build', [
  //   'bowercopy',
  //   'copy',
  //   'webfont'
  // ]);

  grunt.registerTask('run', [
    'bowercopy:dev',
    'copy:dev',
    'webfont',
    'concurrent:watch'
  ]);

  grunt.registerTask('deploy', [
    'bowercopy:dev',
    'copy:dev',
    'webfont',
    'shell:sass_compile',
    'copy:dist',
    'cssmin',
    //'svgmin',
    'clean',
    'uglify',
    //'bowercopy:dist',
   // 'kraken',
    'copy:replacements',
    //'ftpush'
  ]);
  
};