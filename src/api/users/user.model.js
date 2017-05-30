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
          .then(passwordHash => (passwordHash === this.password));
      },
      toJSON() {
        return _.omit(this.get(), ['password', 'salt']);
      },
      token() {
        return _.pick(this.get(), ['id']);
      },
    },
    classMethods: {},
  });

  User.beforeValidate((user) => {
    if (user.isNewRecord) {
      // eslint-disable-next-line no-param-reassign
      user.salt = security.generateSalt();
    }
  });

  function beforeSave(user) {
    if (user.changed('password')) {
      return security.hashPassword(user.password, user.salt)
        .then((passwordHash) => {
          // eslint-disable-next-line no-param-reassign
          user.password = passwordHash;
        });
    }
    return Promise.resolve();
  }

  User.beforeCreate(beforeSave);
  User.beforeUpdate(beforeSave);

  return User;
});
