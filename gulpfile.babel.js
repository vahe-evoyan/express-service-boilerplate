import gulp from 'gulp';
import eslint from 'gulp-eslint';
import mocha from 'gulp-mocha';
import nodemon from 'nodemon';
import merge from 'merge2';
import pages from 'gulp-gh-pages';

import * as swagger from './scripts/gulp.helper';

const SERVER_PATH = './src';
const SPECS_PATH = './spec';
const TEMP_PATH = './.tmp';

gulp.task('lint', () => {
  gulp.src([
    `${SERVER_PATH}/**/*.js`,
    `!${SERVER_PATH}/**/*.spec.js`,
    '!node_modules/**',
  ]).pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('lint:tests', () => {
  gulp.src(`!${SERVER_PATH}/**/*.spec.js`)
    .pipe(eslint({
      plugins: ['chai-expect'],
      envs: ['mocha'],
      globals: ['sinon', 'expect', 'assert'],
      rules: {
        'no-unused-expressions': 0,
      },
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('lint:gulpfile', () => {
  gulp.src('gulpfile.babel.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', () => {
  gulp.src([`${SERVER_PATH}/**/*.spec.js`], {read: false})
    .pipe(mocha({
      checkLeaks: true,
      ui: 'bdd',
      reporter: 'spec',
      timeout: 5000,
      require: ['./test/mocha.init'],
    }));
});

gulp.task('serve', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  nodemon({
    script: SERVER_PATH,
    watch: [SERVER_PATH],
    verbose: true,
  });
});

gulp.task('docs:swagger', () => {
  return merge(gulp.src(`${SPECS_PATH}/swagger.yaml`, {buffer: false}), [
    gulp.src(`${SPECS_PATH}/definitions/**/*.yaml`, {buffer: false})
      .pipe(swagger.merge('definitions')),
    gulp.src(`${SPECS_PATH}/paths/**/*.yaml`, {buffer: false})
      .pipe(swagger.merge('paths')),
  ]).pipe(swagger.concat('swagger.yaml'))
    .pipe(swagger.validate())
    .pipe(gulp.dest(`${TEMP_PATH}/spec`));
});

gulp.task('docs:deploy', () => {
  return gulp.src([
    `${TEMP_PATH}/spec/*`,
    `${SPECS_PATH}/template/*`,
  ]).pipe(pages());
});

gulp.task('docs', ['docs:swagger'], () => {});
