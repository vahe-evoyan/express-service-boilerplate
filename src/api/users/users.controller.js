import {UniqueConstraintError} from 'sequelize/lib/errors';

import User from './user.model';
import {BadRequestError} from '../../lib/errors/http';

export function index(req, res) {
  return User.findAll()
    .then(users => res.status(200).json({users}));
}

/**
 * Register a new user and authenticate the user
 *
 * @param  {Object} req Request
 * @param  {Object} res Result
 * @return {User}   User model
 */
export function create(req, res, next) {
  User.create(req.body)
    .then(() => res.status(204).end())
    .catch(err => {
      if (err instanceof UniqueConstraintError) {
        const message = 'User with the specified email already exists';
        next(new BadRequestError(message));
      } else {
        next(err)
      }
    });
};
