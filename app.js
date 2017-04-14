import http from 'http';
import express from 'express';

import config from './config/environment';

// Setup server
var app = express();
var server = http.createServer(app);

// Start server
function startServer() {
  app.mainServer = server.listen(
    config.port, config.ip, () => {
      console.log(
        'Server listening on %d, in %s mode',
        config.port, app.get('env')
      );
    });
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;
