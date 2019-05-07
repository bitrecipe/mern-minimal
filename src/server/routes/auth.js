import { Router } from 'express';
import * as controllers from './../controllers/auth.js';
const router = new Router();

router.post('/authToken', controllers.authToken);
router.post('/validateAuthToken', controllers.validateAuthToken);
router.post('/users', controllers.createUser);

export default router;