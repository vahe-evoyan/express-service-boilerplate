import express from 'express';
import * as controller from './users.controller';

const router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.get);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);
router.post('/', controller.create);

module.exports = router;
