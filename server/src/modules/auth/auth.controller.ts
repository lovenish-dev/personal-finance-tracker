import type { Request, Response, NextFunction } from 'express'
import { loginUser, registerUser } from './auth.service.js'

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export async function register(req:Request, res:Response, next: NextFunction){
    try{
      const user = await registerUser(req.body);
      res.status(201).json({ success: true, message:"User Registered Successfully", data: user })
    }catch(err){
      next(err)
    }
}

export async function login(req:Request, res:Response, next:NextFunction){
    try{
     const { email, password } = req.body;
     const result = await loginUser(email, password);
     res.status(200).json({ success: true, message:"Login Successful", data: result })
    }catch(err){
       next(err)
    }
}

export function getme(req:AuthenticatedRequest, res:Response){
  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const id = req.userId; 
  res.status(200).json({ userId: id })
}