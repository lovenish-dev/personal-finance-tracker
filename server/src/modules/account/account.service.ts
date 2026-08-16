import { AppError } from "../../utils/Apperror.js";
import { createAccount, getAccountByIdRepo, getAccountByUserId } from "./account.repository.js";
import type { CreateAccountBody } from "./account.types.js";

export async function createAccountService(userId: number, data: CreateAccountBody) {
   const result = await createAccount(userId, data)
   return result;    
}

export async function  getAccountsByUserIdService(user_id: number){
   const result = await getAccountByUserId(user_id);
   return result;
}

export async function getAccountByIdService(accId:number, userId:number){
   const result = await getAccountByIdRepo(accId, userId);
   if(!result) throw new AppError("Account Not Found", 404);
   return result;
}