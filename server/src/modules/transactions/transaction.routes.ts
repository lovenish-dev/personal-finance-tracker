import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { transactionSchema } from "./transaction.schema.js";
import { createTransaction } from "./transactions.controller.js";

const router = Router();

router.post("/", authMiddleware, validate(transactionSchema), createTransaction)

export default router