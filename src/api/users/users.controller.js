import _ from 'lodash';
import {UniqueConstraintError} from 'sequelize/lib/errors';

import User from './user.model';
import {BadRequestError} from '../../lib/errors/http';

/**
 * Get a list of user records
 * @param  {Object} req Request
 * @param  {Object} res Result
 * @return {Response} Array of serialized User models
 */
export function index(req, res) {
  return User.findAll()
    .then(users => res.status(200).json({users}));
}

/**
 * Get a single user record
 * @param  {Object} req Request
 * @param  {int}    req.params.id Unique ID for the User
 * @param  {Object} res Result
 * @return {Response} Serialized User model
 */
export function get(req, res) {
  return User.findOne({where: {id: req.params.id}})
    .then(user => res.status(200).json({user}));
}

/*
 * Update a single user record
 * @param  {Object} req Request
 * @param  {int}    req.params.id Unique ID for the User
 * @param  {Object} res Result
 * @return {Response} Empty 204 Empty response
 */
export function update(req, res) {
  const data = _.pick(req.body, ['email']);
  return User.update(data, {where: {id: req.params.id}})
    .then(() => res.status(204).end());
}

/*
 * Delete a single user record
 * @param  {Object} req Request
 * @param  {int}    req.params.id Unique ID for the User
 * @param  {Object} res Result
 * @return {Response} Empty 204 Empty response
 */
export function remove(req, res) {
  return User.destroy({where: {id: req.params.id}})
    .then(() => res.status(204).end());
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
    .then((user) => res.status(201).json({user}))
    .catch((err) => {
      if (err instanceof UniqueConstraintError) {
        const message = 'User with the specified email already exists';
        next(new BadRequestError(message));
      } else {
        next(err);
      }
    });
}
