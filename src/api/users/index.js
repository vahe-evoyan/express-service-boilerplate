import express from 'express';
import * as controller from './users.controller';

const router = express.Router();

router.get('/', controller.index);

module.exports = router;