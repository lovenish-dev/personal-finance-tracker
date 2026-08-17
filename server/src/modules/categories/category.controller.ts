import type {Request, Response, NextFunction} from 'express'
import type { AuthRequest } from '../../middlewares/auth.middleware.js';
import { AppError } from '../../utils/Apperror.js';
import { createCategoryService } from './category.service.js';

export async function createCategory(req: AuthRequest, res: Response, next: NextFunction){
   try{
   if(!req.userId) throw new AppError("Id not Found", 401);
    const result = await createCategoryService(req.userId, req.body);
    res.status(201).json({ success: true, message:"Category created successfully", data:result })
   }catch(err){
     next(err)
   }
}