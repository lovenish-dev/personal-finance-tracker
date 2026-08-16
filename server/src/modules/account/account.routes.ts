import { Router } from 'express';
import { createAccount, getAccountById, getAccounts } from './account.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { accountSchema } from './account.schema.js';

const router = Router()

router.post('/', authMiddleware, validate(accountSchema), createAccount);
router.get("/", authMiddleware, getAccounts);
router.get("/:id", authMiddleware, getAccountById);

export default router