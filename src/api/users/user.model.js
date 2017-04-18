import _ from 'lodash';

import database from '../../lib/database';
import * as security from '../../lib/security';

export default database.import('User', (sequelize, DataTypes) => {
  const User = sequelize.define('auth_user', {
    id: {
      type: DataTypes.INTEGER,
      field: 'user_id',
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.CHAR(40),
      allowNull: false,
    },
    salt: {
      type: DataTypes.CHAR(32),
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN(),
      allowNull: false,
      defaultValue: false,
    },
  }, {
    underscored: true,
    freezeTableName: true,
    createdAt: 'date_created',
    updatedAt: 'date_updated',
    instanceMethods: {
      verifyPassword(password) {
        return security.hashPassword(password, this.salt)
          .then(passwordHash => {
            return passwordHash === this.password;
          });
      },
      toJSON() {
        return _.omit(this.get(), ['password', 'salt']);
      },
    },
    classMethods: {},
  });

  User.beforeValidate(user => {
    user.salt = security.generateSalt();
  });

  User.beforeCreate(user => {
    return security.hashPassword(user.password, user.salt)
      .then(passwordHash => {
        user.password = passwordHash;
      });
  });

  return User;
});
