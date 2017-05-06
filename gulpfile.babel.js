import gulp from 'gulp';
import eslint from 'gulp-eslint';
import mocha from 'gulp-mocha';
import nodemon from 'nodemon';
import merge from 'merge2';
import pages from 'gulp-gh-pages';
import runSequence from 'run-sequence';
import istanbul from 'gulp-istanbul';
import coverageEnforcer from 'gulp-istanbul-enforcer';
import {Instrumenter} from 'isparta';
import lazypipe from 'lazypipe';

import * as swagger from './scripts/gulp.helper';

const SERVER_PATH = './src';
const HELPERS_PATH = './scripts';
const SPECS_PATH = './spec';
const TEMP_PATH = './.tmp';
const COVERAGE_PATH = './coverage';

const scripts = {
  main: [
    `${SERVER_PATH}/**/*.js`,
    `!${SERVER_PATH}/**/*.spec.js`,
    '!node_modules/**',
  ],
  tests: [`!${SERVER_PATH}/**/*.spec.js`],
  integrationTests: [`!${SERVER_PATH}/**/*.integration.js`],
  helpers: ['gulpfile.babel.js', `${HELPERS_PATH}/**/*.js`],
}

gulp.task('lint', () => {
  gulp.src(scripts.main).pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('lint:tests', () => {
  gulp.src(scripts.tests)
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

gulp.task('lint:helpers', () => {
  gulp.src(scripts.helpers)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

const mochaTests = lazypipe()
  .pipe(mocha, {
    checkLeaks: true,
    ui: 'bdd',
    reporter: 'spec',
    timeout: 5000,
    require: ['./test/mocha.init'],
  });

gulp.task('test', () => {
  gulp.src(scripts.tests, {read: false})
    pipe(mochaTests());
});

const coverage = lazypipe()
  .pipe(istanbul.writeReports, {
      dir: COVERAGE_PATH,
      reportOpts: {dir: COVERAGE_PATH},
      reporters: ['text', 'text-summary', 'json', 'html']
  })
  .pipe(coverageEnforcer, {
      thresholds: {
          statements: 80,
          branches: 50,
          lines: 80,
          functions: 50
      },
      coverageDirectory: COVERAGE_PATH,
      rootDirectory : ''
  });


gulp.task('coverage:setup', () => {
  return gulp.src(scripts.main)
    .pipe(istanbul({
      instrumenter: Instrumenter,
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire());
});

gulp.task('coverage', ['coverage:setup'], () => {
  return gulp.src(`${SERVER_PATH}/**/*.spec.js`, {read: false})
    .pipe(mochaTests())
    .pipe(coverage());
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
