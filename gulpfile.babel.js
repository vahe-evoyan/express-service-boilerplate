import gulp from 'gulp';
import nodemon from 'nodemon';

const SERVER_PATH = '.';

gulp.task('start:server', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  nodemon({
    script: SERVER_PATH,
    watch: [SERVER_PATH],
    verbose: true
  });
});
