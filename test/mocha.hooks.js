import app from '../src';

before((done) => {
  return app.on('ready', done);
});

after((done) => {
  // disconnect from database
  app.mainServer.on('close', done);
  app.mainServer.close();
});
