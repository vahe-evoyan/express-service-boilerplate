import passport from 'passport';

import {ForbiddenError} from '../../lib/errors/http';
import {createJwtToken} from '../../lib/security';

export function login(req, res, next) {
  passport.authenticate('local', (err, user) => {
    if (err) return next(err);
    if (!user) {
      const message = 'Incorrect credentials. Authentication failed.';
      return next(new ForbiddenError(message));
    }
    const token = createJwtToken(user.token());
    return res.status(200).json({token, user});
  })(req, res, next);
}

export function logout() {
}
