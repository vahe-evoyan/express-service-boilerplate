import shrinkRay from 'shrink-ray';
import bodyParser from 'body-parser';
import lusca from 'lusca';
import cors from 'cors';

export default function(app, server) {
  var env = app.get('env');

  app.use(cors());
  app.use(shrinkRay());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json({
    verify(req, res, buf) {
      req.rawBody = buf;
    }
  }));

  if (env !== 'test') {
    app.use(lusca({
      xframe: 'SAMEORIGIN',
      hsts: {
        maxAge: 31536000, // 1 year, in seconds
        includeSubDomains: true,
        preload: true
      },
      xssProtection: true
    }));
  }
}
