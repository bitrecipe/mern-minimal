import { Router } from 'express';
import * as controllers from './../controllers/common.js';
import { authenticate } from './../middlewares/auth.js';
const router = new Router();

router.post('/countries', authenticate(), controllers.getCountries);

export default router;