module.exports = function(grunt) {

  // подключаем плагин load-grunt-tasks, чтобы не перечислять все прочие плагины
  require('load-grunt-tasks')(grunt);

  // описываем задачи, которые планируем использовать (их запуск - см. низ этого файла)
  grunt.initConfig({

    // компилируем препроцессор
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          // в какой файл, из какого файла
          'build/css/screen.css': ['src/sass/screen.sass']
        },
      }
    },

    // обрабатываем postcss-ом (там только autoprefixer, на самом деле)
    postcss: {
      options: {
        processors: [
          // автопрефиксер и его настройки
          require("autoprefixer")({browsers: "last 2 versions"})
        ]
      },
      style: {
        // какие файлы обрабатывать (все .css в указанной папке)
        src: "build/css/*.css"
      }
    },

    // объединяем медиавыражения
    cmq: {
      style: {
        files: {
          // в какой файл, из какого файла (тут это один и тот же файл)
          'build/css/screen.css': ['build/css/screen.css']
        }
      }
    },

    // минимизируем стилевые файлы
    cssmin: {
      style: {
        options: {
          keepSpecialComments: 0
        },
        files: [{
          expand: true,
          // в какой папке брать исходники
          cwd: 'build/css',
          // какие файлы (ЛЮБОЕ_ИМЯ.css, но не ЛЮБОЕ_ИМЯ.min.css)
          src: ['*.css', '!*.min.css'],
          // в какую папку писать результат
          dest: 'build/css',
          // какое расширение дать результатам обработки
          ext: '.min.css'
        }]
      }
    },

    // процесс копирования
    copy: {
      // копируем картинки
      img: {
        expand: true,
        // откуда
        cwd: 'src/img/',
        // какие файлы (все картинки (см. расширения) из корня указанной папки и всех подпапок)
        src: ['**/*.{png,jpg,gif,svg}'],
        // куда
        dest: 'build/img/',
      },

      js: {
        expand: true,
        // откуда
        cwd: 'src/js/',
        // какие файлы
        src: ['*.js'],
        // куда
        dest: 'build/js/',
      },
    },

    // публикация на GitHub Pages (будет доступен в сети по адресу http://ВАШ-НИКНЕЙМ.github.io/ВАШ-РЕПОЗИТОРИЙ/)
    'gh-pages': {
      options: {
        // какую папку считать результатом работы
        base: 'build'
      },
      src: '**/*'
    },

    // слежение за файлами
    watch: {
      // перезагрузка? да, детка!
      livereload: {
        options: { livereload: true },
        files: ['build/**/*'],
      },
      // следить за стилями
      style: {
        // за фактом с сохранения каких файлов следить
        files: ['src/sass/**/*.sass'],
        // какую задачу при этом запускать (сами задачи — см. ниже)
        tasks: ['style'],
        options: {
          spawn: false,
        },
      },
      // следить за картинками
      images: {
        // за фактом с сохранения каких файлов следить
        files: ['src/img/**/*.{png,jpg,gif,svg}'],
        // какую задачу при этом запускать (сами задачи — см. ниже)
        tasks: ['img'],
        options: {
          spawn: false
        },
      },
      // следить за файлами разметки
      html: {
        // за фактом с сохранения каких файлов следить
        files: ['src/*.html'],
        // какую задачу при этом запускать (указан сам процесс)
        options: {
          spawn: false
        },
      },
    },

    sprite:{
      all: {
        src: 'src/img/icons/*.png',
        dest: 'src/img/sprites.png',
        destCss: 'src/sass/sprites.sass',
        padding: 15,
        algorithm: "top-down"
      }
    },

    grunticon: {
      myIcons: {
        files: [{
          expand: true,
          cwd: 'src/img/svg',
          src: ['*.svg'],
          dest: "src/img/sprites-svg"
        }],
        options: {
          svgo: true,
          pngcrush: true,
        }
      }
    },

    // локальный сервер, автообновление
    browserSync: {
      dev: {
        bsFiles: {
          // за изменением каких файлов следить для автообновления открытой в браузере страницы с локального сервера
          src : [
            'build/css/*.css',
            'build/js/*.js',
            'build/img/*.{png,jpg,gif,svg}',
            'build/*.html',
          ]
        },
        options: {
          watchTask: true,
          server: {
            // корень сервера
            baseDir: "build/",
          },
          // синхронизация между браузерами и устройствами (если одна и та же страница открыта в нескольких браузерах)
          ghostMode: {
            clicks: true,
            forms: true,
            scroll: false
          }
        }
      }
    }

  });



  // задача по умолчанию
  grunt.registerTask('default', [
    'style',
    'img',
    'copy:js',
    'browserSync',
    'watch'
  ]);

  // только компиляция стилей
  grunt.registerTask('style', [
    'sass',
    'postcss',
    'cmq',
    'cssmin',
  ]);

  // только обработка картинок
  grunt.registerTask('img', [
    'copy:img',
  ]);

  // сборка
  grunt.registerTask('build', [
    'style',
    'img',
    'gh-pages',
  ]);

};
