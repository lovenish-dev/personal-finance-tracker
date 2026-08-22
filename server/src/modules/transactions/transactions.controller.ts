import type { Response, NextFunction } from 'express';
import { createTransactionService, deleteTransactionService, getTransactionByUserIdService, getTransactionsByUserIdService, updateTransactionService } from './transaction.service.js';
import type { AuthRequest } from '../../middlewares/auth.middleware.js';
import { AppError } from '../../utils/Apperror.js';

export async function createTransaction(req: AuthRequest, res: Response, next: NextFunction){
    try{
    if(!req.userId) throw new AppError("Id not Found", 401);
    const result = await createTransactionService(req.userId, req.body);
    res.status(201).json({ success: true, message:"Transaction created successfully", data: result }) 
    }catch(err){
     next(err)
    }
}

export async function getTransactionsByUserId(req:AuthRequest, res:Response, next:NextFunction){
    try{
      if(!req.userId) throw new AppError("Id not found", 401);
      const result = await getTransactionsByUserIdService(req.userId);
      res.status(200).json({ success: true, message: "Transactions fetched successfully", data: result })
    }catch(err){
        next(err)
    }
}

export async function getTransactionByUserId(req:AuthRequest, res: Response, next: NextFunction){
    try{
     if(!req.userId) throw new AppError("Id not found", 401);
     const id = Number(req.params.id)
     const result = await getTransactionByUserIdService(id, req.userId);
     res.status(200).json({ success: true, message:"Transaction fetched successfully", data: result })
    }catch(err){
        next(err)
    }
}

export async function deleteTransaction(req:AuthRequest, res:Response, next:NextFunction){
   try{
     if(!req.userId) throw new AppError("Id not found", 401);
     const id = Number(req.params.id);
     const result = await deleteTransactionService(req.userId, id);
     res.status(200).json({ success: true, message:"Transaction deleted successfully", data: result });
   }catch(err){
      next(err)
   }
}

export async function updateTransaction(req: AuthRequest, res:Response, next:NextFunction){
   try{
     if(!req.userId) throw new AppError("Id not found", 401);
     const id = Number(req.params.id);
     const result = await updateTransactionService(req.userId, id, req.body);
     res.status(201).json({ success: true, message:"Transaction updated successfully", data: result });
   }catch(err){
     next(err)
   }
}