module.exports = function (grunt) {
  var time = grunt.template.today("yyyymmddHHMMss");
  //var fs = require('fs');
  var path = require('path');
  var temp = 'dist';

  grunt.initConfig({
    concat: {
      dist: {
        src: ['js/lib/jquery-2.1.4.min.js','js/lib/underscore-min.js','js/lib/backbone-min.js',
          'js/lib/handlebars.min.js','js/lib/materialize.min.js'],
        dest: temp + '/js/lib/lib.js'
      },
      dist_min: {
        src: ['js/lib/zepto.min.js','js/lib/underscore-min.js','js/lib/backbone-min.js',
          'js/lib/handlebars.min.js'],
        dest: temp + '/js/lib/lib-mobile.js'
      },
      native: {
        src: ['js/src/common/native.js'],
        dest: temp+'/js/src/common/native.js'
      }
    },
    combo: {
      options: {
        "include": "relative"
      },
      src: {
        files: [{
          expand: true,
          cwd: 'js/src/',
          src: ['module/**/*.js'],
          dest: temp + '/js/src',
          ext: '.js'
        }]
      }
    },
    uglify: {
      options: {
        // 生成注释并插入到输出文件的顶部
        banner: '/* ' + temp + ' */\n'
      },
      src: {
        files: [{
          expand: true,
          src: [temp + '/js/**/*.js',temp + '/js/**/*.*.js'],
          ext: '.js'
        }]
      }
    },
    copy: {
      cssimg: {
        expand: true,
        src: ['image/**','fonts/**'],
        dest: temp
      }
    },
    filerev: {
      options: {
        algorithm: 'sha1',
        length: 8
      },
      src: {
        files: [{
          expand: true,
          cwd: 'dist/',
          src: [
            'js/**/*.js',
            'css/**/*.css',
            'static/**/*'
          ],
          dest: 'dist/'
        }]
      }
    },
    /**param no dev test release 区别只是替换的路径不同
     **/
    'string-replace': {
      no: {
        files: [{
          expand: true,
          src: ['html/**/*.html'],
          dest: 'dist'
        }]
      },
      dev: {
        files: [{
          expand: true,
          src: ['html/**/*.html'],
          dest: 'dist'
        }],
        options: {
          replacements: [{
            pattern: /<!--\(if target release\)>([\s\S]*?)<!\(endif\)-->/gm,
            replacement: function(match, p1) {
              return p1.replace("var env = 'release';", "var env = 'dev';");
            }
          }, {
            pattern: /<!--\(if target dev\)>[\s\S]*?<!--<!\(endif\)-->/gm,
            replacement: ''
          }, {
            pattern: /="(\.\.\/)(.*?)"/gm,
            replacement: function(match, p1, p2) {
              if (p2.indexOf('.js') > 0 || p2.indexOf('.css') > 0) {
                //console.log(grunt.filerev);
                var distPath = grunt.filerev.summary[path.join('dist/' + p2)];
                //if (!grunt.filerev.summary['dist' + p2]) {
                if(!distPath){
                  throw new Error('can not founde ' + p2);
                }
                return match.replace(p1, '')
                    .replace(p2, distPath.replace('dist/', ''));
              } else {
                return match.replace(p1, '');
              }
            }
          }]
        }
      },
      release: {
        files: [{
          expand: true,
          src: ['html/**/*.html'],
          dest: 'dist'
        }],
        options: {
          replacements: [{
            pattern: /<!--\(if target release\)>([\s\S]*?)<!\(endif\)-->/gm,
            replacement: function (match, p1) {
              return p1.replace(/{{ver}}/g, 'v=' + time);
            }
          }, {
            pattern: /<!--\(if target dev\)>[\s\S]*?<!--<!\(endif\)-->/gm,
            replacement: ''
          }, {
            pattern: /="(\.\.\/)(.*?)"/gm,
            replacement: function(match, p1, p2) {
              if (p2.indexOf('.js') > 0 || p2.indexOf('.css') > 0) {
                //console.log(grunt.filerev);
                var distPath = grunt.filerev.summary[path.join('dist/' + p2)];
                //if (!grunt.filerev.summary['dist' + p2]) {
                if(!distPath){
                  throw new Error('can not founde ' + p2);
                }
                return match.replace(p1, '')
                    .replace(p2, distPath.replace('dist/', ''));
              } else {
                return match.replace(p1, '');
              }
            }
          }]
        }
      }
    },
    sass: {
      dev: {
        options: {
          style: 'expanded',
          lineNumbers: true
        },
        expand: true,
        cwd: 'sass',
        src: ['**/*.sass'],
        dest: temp + '/css',
        ext: '.css'
      },
      release: {
        options: {
          style: 'compressed',
          sourcemap: 'none'
        },
        expand: true,
        cwd: 'sass',
        src: ['**/*.sass'],
        dest: temp + '/css',
        ext: '.css'
      }
    },
    clean: {
      dist: {
        src: ['dist/*']
      }
    },
    shell: {
      touchTime: {
        command: function () {
          return 'touch dist/' + time;
        }
      },
      rm201: {
        command: 'rm -rf dist/201*'
      },
      mvFile: {
        command: function (dest) {
          return [
            'mkdir ' + dest,
            'mv dist/css ' + dest + '/',
            'mv dist/js ' + dest + '/',
          ].join('&&');
        }
      },
      cpFile: {
        command: function (dest) {
          return [
            'mkdir ' + dest,
            'cp -r dist/css ' + dest + '/',
            'cp -r dist/js ' + dest + '/',
          ].join('&&');
        }
      }
    }
  });
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', [
    'sass:dev',
    'concat',
    'copy',
    'combo',
    'string-replace:no'
  ]);
  grunt.registerTask('dev', function (arg1) {
    grunt.task.run('clean');
    var type = arg1;
    if (type === 'min') {
      grunt.task.run('sass:dev', 'copy', 'concat','combo','uglify',
          'filerev', 'string-replace:dev', 'shell:touchTime');
    } else {
      grunt.task.run('copy', 'sass:dev', 'concat','combo',
          'filerev', 'string-replace:dev', 'shell:touchTime');
    }
  });
  grunt.registerTask('release', function (arg1) {
    grunt.task.run('clean');
    var type = arg1;
    if (type === 'min') {
      grunt.task.run('sass:release', 'copy', 'concat','combo','uglify',
          'filerev', 'string-replace:release', 'shell:touchTime');
    } else {
      grunt.task.run('copy', 'sass:dev', 'concat','combo',
          'filerev', 'string-replace:release', 'shell:touchTime');
    }
  });
};
