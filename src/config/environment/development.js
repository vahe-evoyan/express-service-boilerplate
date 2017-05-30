// Development specific configuration
// ==================================
module.exports = {
  sequelize: {
    uri: 'sqlite://dev.db/express_app',
    options: {
      dialect: 'sqlite',
      storage: './dev.db',
    },
  },

  jwt: {
    secret: 'secret',
    expires: '1y',
  },
};
