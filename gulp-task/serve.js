'use strict';

var browserSync = require('browser-sync'),
  gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  reload = browserSync.reload;

gulp.task('serve', ['browser-sync'], function () {
  gulp.watch('views/**/*.ejs').on('change', reload);
  gulp.watch('**/*.*').on('change', reload);
});

gulp.task('browser-sync', ['nodemon'], function () {
  browserSync.init(null, {
    proxy: 'http://localhost:3000',
    browser: 'chrome',
    port: 3030
  });
});

gulp.task('nodemon', [], function (done) {
  var running = false;
  return nodemon({
    script: 'server.js',
    watch: ['*.*']
  }).on('start', function () {
    if (!running) {
      done();
    }
    running = true;
  }).on('restart', function () {
    setTimeout(function () {
      reload();
    }, 500);
  });
});