import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import { createAccountService, getAccountByIdService, getAccountsByUserIdService, updateAccountService } from "./account.service.js";
import { AppError } from "../../utils/Apperror.js";

export async function createAccount(req:AuthRequest, res:Response, next:NextFunction){
  try{
    if(!req.userId) throw new AppError("Id Not Found", 401);
    const result = await createAccountService(req.userId, req.body);
    res.status(200).json({ success: true, message:"Account created successfully", data: result })
  }catch(err){
    next(err)
  }
}

export async function getAccounts(req:AuthRequest, res:Response, next:NextFunction){
   try{
    if(!req.userId) throw new AppError("Id Not Found", 401);
    const result = await getAccountsByUserIdService(req.userId);
    res.status(200).json({ success:true, message:"Accounts fetched", data: result });
   }catch(err){
    next(err)
   }
}

export async function getAccountById(req:AuthRequest, res:Response, next:NextFunction){
    try{
    if(!req.userId) throw new AppError("Id Not Found", 401);
    const id = Number(req.params.id)
    if(Number.isNaN(id) || id <= 0) throw new AppError("Invalid Account ID", 400);
    const result = await getAccountByIdService(id, req.userId)
    res.status(200).json({ success: true, message:"Account fetched", data: result });
    }catch(err){
      next(err)
    }
}

export async function updateAccount(req:AuthRequest, res: Response, next:NextFunction){
  try{
    if(!req.userId) throw new AppError("Id not Found", 401);
    const accountId = Number(req.params.id);
    if(Number.isNaN(accountId) || accountId <= 0) throw new AppError("Invalid Account ID", 400);
    const account = await updateAccountService(accountId, req.userId, req.body);
    res.status(201).json({ success: true, message:"Account updated", data: account });
  }catch(err){
     next(err)
  }
}