import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getCategorySummary, getDashboardSummary } from "./dashboard.controller.js";

const router = Router();

router.get("/", authMiddleware, getDashboardSummary);
router.get("/category", authMiddleware, getCategorySummary);

export default router;