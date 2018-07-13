import express from 'express';
import winston from 'winston';

import {HttpError} from '../lib/errors/http';

export default function(app) {
  const router = express.Router();
  /* eslint-disable global-require */
  router.use('/users', require('../api/users'));
  router.use('/auth', require('../api/auth'));
  /* eslint-enable global-require */
  app.use('/api/v1', router);

  app.route('/*')
    .get((req, res) => {
      res.status(404).end();
    });

  /**
   * Default error handler
   *
   * Requires the full set of arguments to distinct from a regular middleware
   *
   * @param  {Error|Object}   err  Error that is passed via next functions
   * @param  {Request}        req  Request object
   * @param  {ServerResponse} res  Server response crafted in the endpoint
   * @param  {Function}       next Continues the express middleware stack
   */
  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    winston.error(err);
    if (err instanceof HttpError) {
      res.status(err.status).json({error: err.toJSON()});
    } else {
      res.status(500).end();
    }
  });
}
