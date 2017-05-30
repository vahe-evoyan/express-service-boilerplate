import shrinkRay from 'shrink-ray';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import lusca from 'lusca';
import cors from 'cors';

import config from './environment';

export default function(app) {
  const env = app.get('env');

  app.use(cors());
  app.use(shrinkRay());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json({
    verify(req, res, buf) {
      req.rawBody = buf;
    },
  }));
  app.use(expressJwt({secret: config.jwt.secret})
    .unless({
      path: [
        {url: /\/auth\/?$/ig, methods: ['POST']}
      ],
    }));

  if (env !== 'test') {
    app.use(lusca({
      xframe: 'SAMEORIGIN',
      hsts: {
        maxAge: 31536000, // 1 year, in seconds
        includeSubDomains: true,
        preload: true,
      },
      xssProtection: true,
    }));
  }
}
