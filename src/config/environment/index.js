/* eslint import/no-dynamic-require:0 global-require:0 */
import _ from 'lodash';

const base = {
  env: process.env.NODE_ENV,

  // Protocol
  protocol: process.env.PROTOCOL || 'http://',

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Server port
  port: process.env.PORT || 9000,

  sequelize: {
    uri: process.env.DATABASE_URL || 'mysql://localhost/express_app',
    options: {
      dialect: 'mysql',
    },
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    issuer: 'example.com',
    expires: '2h',
  },
};

// Export the config object based on the NODE_ENV
// ==============================================
const env = require(`./${process.env.NODE_ENV}.js`) || {};
const common = require('./common');

module.exports = _.merge({}, base, common, env);
