import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { categorySchema } from "./category.schema.js";
import { createCategory } from "./category.controller.js";

const router = Router();

router.post("/", authMiddleware, validate(categorySchema), createCategory);

export default router;