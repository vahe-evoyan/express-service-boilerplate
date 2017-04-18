import _ from 'lodash';
import passport from 'passport';
import {Strategy} from 'passport-local';

import User from '../api/users/user.model';
import {
  AuthenticationError,
  IncorrectUsernameError,
  IncorrectPasswordError,
} from '../lib/errors/auth';

/**
 * Define authentication strategy
 */
function authenticate(email, password) {
  return User.findOne({email}).then(user => {
    if (!user) throw new IncorrectUsernameError();
    return user.verifyPassword(password)
      .then(valid => {
        if (!valid) throw new IncorrectPasswordError();
        return user;
      });
  });
}

passport.use(new Strategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, done) => {
  authenticate(email, password)
    .then(user => done(null, user))
    .catch(err => {
      if (err instanceof AuthenticationError) {
        done(null, false, err);
      } else {
        done(err);
      }
    });
}));

export default function(app) {
  app.use(passport.initialize());
}
