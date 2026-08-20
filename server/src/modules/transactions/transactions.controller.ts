import type { Response, NextFunction } from 'express';
import { createTransactionService } from './transaction.service.js';
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