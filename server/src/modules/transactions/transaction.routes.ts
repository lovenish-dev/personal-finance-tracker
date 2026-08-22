import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { transactionSchema, updateTransactionSchema } from "./transaction.schema.js";
import { createTransaction, deleteTransaction, getTransactionByUserId, getTransactionsByUserId, updateTransaction } from "./transactions.controller.js";

const router = Router();

router.post("/", authMiddleware, validate(transactionSchema), createTransaction)
router.get("/", authMiddleware, getTransactionsByUserId)
router.get("/:id", authMiddleware, getTransactionByUserId)
router.delete("/:id", authMiddleware, deleteTransaction)
router.patch("/:id", authMiddleware, validate(updateTransactionSchema), updateTransaction);

export default router