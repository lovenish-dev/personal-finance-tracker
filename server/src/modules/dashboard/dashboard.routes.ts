import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getCategorySummary, getDashboardSummary, getMonthlySummary } from "./dashboard.controller.js";

const router = Router();

router.get("/", authMiddleware, getDashboardSummary);
router.get("/category", authMiddleware, getCategorySummary);
router.get("/monthly", authMiddleware, getMonthlySummary)

export default router;