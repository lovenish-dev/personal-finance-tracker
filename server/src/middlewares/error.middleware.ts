import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/Apperror.js';

export function errorMiddleware(error: unknown, req:Request, res: Response, next: NextFunction){
    if(error instanceof AppError){
        return res.status(error.statusCode).json({ success: false, message: error.message })
    }
    console.error('Unhandled Error: ', error)
    return res.status(500).json({ success:false, message:"Internal Server Error" });
}