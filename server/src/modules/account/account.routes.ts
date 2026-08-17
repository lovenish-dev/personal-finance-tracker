import { Router } from 'express';
import { createAccount, getAccountById, getAccounts, updateAccount } from './account.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { accountSchema, updateAccountSchema } from './account.schema.js';

const router = Router()

router.post('/', authMiddleware, validate(accountSchema), createAccount);
router.get("/", authMiddleware, getAccounts);
router.get("/:id", authMiddleware, getAccountById);
router.patch("/:id", authMiddleware, validate(updateAccountSchema) ,updateAccount);

export default router