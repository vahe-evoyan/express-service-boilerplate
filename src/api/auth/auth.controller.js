import passport from 'passport';

import {ForbiddenError} from '../../lib/errors/http';

export function login(req, res, next) {
  passport.authenticate('local', (err, user) => {
    if (err) return next(err);
    if (!user) {
      const message = 'Incorrect credentials. Authentication failed.';
      return next(new ForbiddenError(message));
    }
    return res.status(200).json({user});
  })(req, res, next);
}

export function logout() {
}
