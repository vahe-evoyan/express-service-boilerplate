import User from './user.model';

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
export function create(req, res) {
  User.create(req.body)
    .then(() => res.status(204).end());
};
