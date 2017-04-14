/* eslint import/no-extraneous-dependencies:0 global-require:0 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const env = process.env.NODE_ENV;

if (env === 'development' || env === 'test') {
  // Register the Babel require hook
  require('babel-register');
  require('babel-polyfill');
}

// Export the application
module.exports = require('./app');
