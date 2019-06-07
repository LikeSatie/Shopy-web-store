const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const rimraf = require('rimraf');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');

// Static server
gulp.task('server', function() {
  browserSync.init({
    server: {
      port: 9000,
      baseDir: 'dist'
    }
  });
  gulp.watch('dist/**/*').on('change', browserSync.reload);
});

// Pug compile
gulp.task('templates:compile', function buildHTML() {
  return gulp
    .src('src/templates/index.pug')
    .pipe(
      pug({
        pretty: true
      })
    )
    .pipe(gulp.dest('dist'));
});

// Sass compile
gulp.task('styles:compile', function() {
  return gulp
    .src('src/styles/**/main.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('dist/css'));
});

// Delete dist folder, before building the project
gulp.task('clean', function del(cb) {
  return rimraf('dist', cb);
});

// Copy Fonts
gulp.task('copy:fonts', function() {
  return gulp.src('src/fonts/**/*.*').pipe(gulp.dest('dist/fonts'));
});

// Copy images
gulp.task('copy:images', function() {
  return gulp.src('src/images/**/*.*').pipe(gulp.dest('dist/images'));
});

// Image minifying
gulp.task('imagemin', () =>
  gulp
    .src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
);

// Copy fonts & images
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

// Watchers
gulp.task('watch', function() {
  gulp.watch('src/templates/**/*.pug', gulp.series('templates:compile'));
  gulp.watch('src/styles/**/*.scss', gulp.series('styles:compile'));
  gulp.watch('src/images/**/*', gulp.series('imagemin'));
});

// Default (cmd:gulp)
gulp.task(
  'default',
  gulp.series(
    'clean',
    gulp.parallel('templates:compile', 'styles:compile', 'copy', 'imagemin'),
    gulp.parallel('watch', 'server')
  )
);
