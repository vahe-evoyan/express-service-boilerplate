import gulp from 'gulp';
import eslint from 'gulp-eslint';
import mocha from 'gulp-mocha';
import nodemon from 'nodemon';

const SERVER_PATH = './src';

gulp.task('lint', () => {
  gulp.src([`${SERVER_PATH}/**/*.js`, '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('lint:gulpfile', () => {
  gulp.src('gulpfile.babel.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', function () {
  gulp.src([`${SERVER_PATH}/**/*.spec.js`], {read: false})
    .pipe(mocha({
      checkLeaks: true,
      ui: 'bdd',
      reporter: 'spec',
      timeout: 5000,
      require: ['./test/mocha.init']
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
