import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/Apperror.js';

export function errorMiddleware(error: unknown, req:Request, res: Response, next: NextFunction){
    if(error instanceof AppError){
        return res.status(error.statusCode).json({ success: false, message: error.message })
    }

    return res.status(500).json({ message:"Internal Server Error" });
}