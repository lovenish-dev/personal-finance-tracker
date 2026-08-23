import type { NextFunction, Request, Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import { AppError } from "../../utils/Apperror.js";
import { getCategorySummaryService, getDashboardSummaryService } from "./dashboard.service.js";

export async function getDashboardSummary(req:AuthRequest, res:Response, next:NextFunction) {
   try{
     if(!req.userId) throw new AppError("Id not found", 401);
     const result = await getDashboardSummaryService(req.userId);
     res.status(200).json({ success: true, message:"Dashboard summary fetched successfully", data:result })
   }catch(err){
    next(err)
   }
}

export async function getCategorySummary(req:AuthRequest, res: Response, next: NextFunction){
   try{
    if(!req.userId) throw new AppError("Id not found", 401);
    const result = await getCategorySummaryService(req.userId);
    res.status(200).json({ success: true, message:"Category summary fetched successfully", data: result })
   }catch(err){
    next(err)
   }
}