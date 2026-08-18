import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { categorySchema, UpdateCategorySchema } from "./category.schema.js";
import { createCategory, deleteCategory, getCategoriesByUserId, getCategoryById, updateCategory } from "./category.controller.js";

const router = Router();

router.post("/", authMiddleware, validate(categorySchema), createCategory);
router.get("/", authMiddleware, getCategoriesByUserId);
router.get("/:id", authMiddleware, getCategoryById);
router.patch("/:id", authMiddleware, validate(UpdateCategorySchema), updateCategory);
router.delete("/:id", authMiddleware, deleteCategory);

export default router;