import http from 'http';
import express from 'express';
import winston from 'winston';

import config from './config/environment';

// Setup server
let app = express();
const server = http.createServer(app);

// Start server
function startServer() {
  app.mainServer = server.listen(
    config.port, config.ip, () => {
      winston.info(
        'Server listening on %d, in %s mode',
        config.port,
        app.get('env'),
      );
    });
}

setImmediate(startServer);

// Expose app
module.exports = app;
