import User from './user.model';

export function index(req, res) {
  return User.findAll()
    .then(users => res.status(200).json({users}));
}

export function create(req, res) {
  return res.status(204).end();
}
