import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import { createAccountService, getAccountByIdService, getAccountsByUserIdService } from "./account.service.js";
import { AppError } from "../../utils/Apperror.js";

export async function createAccount(req:AuthRequest, res:Response, next:NextFunction){
  try{
    if(!req.userId) throw new AppError("Id Not Found", 401);
    const result = await createAccountService(req.userId, req.body);
    res.status(201).json({ success: true, message:"Account Created Successfully", data: result })
  }catch(err){
    next(err)
  }
}

export async function getAccounts(req:AuthRequest, res:Response, next:NextFunction){
   try{
    if(!req.userId) throw new AppError("Id Not Found", 401);
    const result = await getAccountsByUserIdService(req.userId);
    res.status(200).json({ success:true, message:"Accounts Fetched", data: result });
   }catch(err){
    next(err)
   }
}

export async function getAccountById(req:AuthRequest, res:Response, next:NextFunction){
    try{
    const id = req.params.id
    if(!req.userId) throw new AppError("Id Not Found", 401);
    const result = await getAccountByIdService(Number(id), req.userId)
    res.status(200).json({ success: true, message:"Account Fetched", data: result });
    }catch(err){
      next(err)
    }
}