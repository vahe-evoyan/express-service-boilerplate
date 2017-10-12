// Development specific configuration
// ==================================
module.exports = {
  port: 23700,
  sequelize: {
    uri: 'sqlite://dev.db/express_app',
    options: {
      dialect: 'sqlite',
      storage: ':memory:',
    },
  },
};
