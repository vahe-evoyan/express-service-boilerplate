import database from '../../lib/database';
import {hashPassword} from '../../lib/security';

export default database.import('User', (sequelize, DataTypes) => {
  const User = sequelize.define('auth_user', {
    userId: {
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
    instanceMethods: {
      /**
       * Verifies if the specified password matches user's password.
       *
       * @param  {String} password Password to verify
       * @return {Boolean} True if the password matches to stored one
       */
      verifyPassword(password) {
        const passwordHash = hashPassword(password, this.salt);
        return this.password === passwordHash;
      },
    },
    classMethods: {},
  });

  return User;
});
