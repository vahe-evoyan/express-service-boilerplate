/* eslint import/no-dynamic-require:0 global-require:0 */

const base = {
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
const env = require(`./${process.env.NODE_ENV}.js`) || {};
const common = require('./common');

module.exports = {...base, ...common, ...env};
