/*eslint no-process-env:0*/

let base = {
  env: process.env.NODE_ENV,

  // Protocol
  protocol: process.env.PROTOCOL || 'http://',

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Server port
  port: process.env.PORT || 9000,
};
// Export the config object based on the NODE_ENV
// ==============================================
const common = require('./common');
const env = require(`./${process.env.NODE_ENV}.js`) || {};
module.exports = {...base, ...common, ...env};
