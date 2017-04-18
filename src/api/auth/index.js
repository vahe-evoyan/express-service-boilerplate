import express from 'express';
import * as controller from './auth.controller';

const router = express.Router();

router.post('/', controller.login);
router.delete('/', controller.logout);

module.exports = router;
