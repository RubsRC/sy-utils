'use strict';

var gulp = require('gulp'),
  wrench = require('wrench');

wrench.readdirSyncRecursive('./gulp-task')
  .filter(function (file) {
    return (/\.(js)$/i).test(file);
  })
  .map(function (file) {
    require('./gulp-task/' + file);
  });

gulp.task('default', ['serve']);