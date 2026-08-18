import type {Request, Response, NextFunction} from 'express'
import type { AuthRequest } from '../../middlewares/auth.middleware.js';
import { AppError } from '../../utils/Apperror.js';
import { createCategoryService, getCategoriesByUserIdService, getCategoryByIdService, updateCategoryService } from './category.service.js';

export async function createCategory(req: AuthRequest, res: Response, next: NextFunction){
   try{
   if(!req.userId) throw new AppError("Id not Found", 401);
    const result = await createCategoryService(req.userId, req.body);
    res.status(201).json({ success: true, message:"Category created successfully", data:result })
   }catch(err){
     next(err)
   }
}

export async function getCategoriesByUserId(req:AuthRequest , res:Response, next: NextFunction){
  try{
    if(!req.userId) throw new AppError("Id Not Found", 401);
    const result = await getCategoriesByUserIdService(req.userId);
    res.status(200).json({ success: true, message:"Categories fetched successfully", data: result });
  }catch(err){
    next(err)
  }
}

export async function getCategoryById(req: AuthRequest, res:Response, next: NextFunction){
  try{
   if(!req.userId) throw new AppError("Id not Found", 401);
   const id = Number(req.params.id);
   const result = await getCategoryByIdService(req.userId, id);
   res.status(200).json({ success: true, message:"Category fetched successfully", data: result });
  }catch(err){
    next(err)
  }
}

export async function updateCategory(req:AuthRequest, res:Response, next:NextFunction){
   try{
    if(!req.userId) throw new AppError("Id Not Found", 401);
    const id = Number(req.params.id);
    const result = await updateCategoryService(id, req.userId, req.body);
    res.status(201).json({ success: true, message:"Category updated successfully", data: result})
   }catch(err){
     next(err)
   }
}