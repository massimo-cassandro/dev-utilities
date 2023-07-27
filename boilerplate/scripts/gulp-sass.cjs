/* eslint-env node */

// gulp --gulpfile ./scripts/gulp-sass.cjs

const gulp = require('gulp'),
  path = require('node:path'),
  using = require('gulp-using'),
  postcss = require('gulp-postcss'),
  sass = require('gulp-sass')(require('sass')),
  sourcemaps = require('gulp-sourcemaps');

// CLI
// npx sass ./scss/:../liste-sf/public/css/ --load-path=./node_modules/ --style=compressed --watch
// npx postcss ../liste-sf/public/css/**/*.css --config ./ --map --verbose --dir ../liste-sf/public/css/ --base ../liste-sf/public/css/


/*
  docs:
  https://www.npmjs.com/package/gulp-sass
  https://www.npmjs.com/package/gulp-postcss
  https://github.com/gulp-sourcemaps/gulp-sourcemaps

*/

const sources = [path.resolve( __dirname, '../scss/*.scss')],
  dest = path.resolve( __dirname, '../../liste-sf/public/css/');

gulp.task('css', function () {

  return gulp.src(sources)
    .pipe(using({
      prefix: 'Processing',
      path: 'relative'
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: [path.resolve( __dirname, '../node_modules/')]
    }).on('error', sass.logError))
    .pipe(postcss({
      config: path.resolve( __dirname, './postcss.config.js')
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dest));
});

gulp.task('watch', function () {
  gulp.watch(sources, gulp.series('css'));
});

gulp.task('default', gulp.series('css', 'watch'));
