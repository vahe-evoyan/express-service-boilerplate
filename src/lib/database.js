import Sequelize from 'sequelize';
import config from '../config/environment';

const sequelize = new Sequelize(
  config.sequelize.uri,
  config.sequelize.options,
);

export default sequelize;
