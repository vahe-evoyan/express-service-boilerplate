import http from 'http';
import express from 'express';
import winston from 'winston';

import config from './config/environment';
import database from './lib/database';

// Setup server
const app = express();
const server = http.createServer(app);

require('./config/express').default(app, server);
require('./config/routes').default(app);
require('./config/auth').default(app);

// Start server
database.sync().then(() => {
  app.mainServer = server.listen(
    config.port, config.ip, () => {
      winston.info(
        'Server listening on %d, in %s mode',
        config.port,
        app.get('env'),
      );
    });
});

// Expose app
module.exports = app;
