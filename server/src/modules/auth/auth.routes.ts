import { Router } from 'express';
import { register } from './auth.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { registerSchema } from './auth.schema.js';

const router = Router();

router.get('/user', validate(registerSchema), register)

export default router;