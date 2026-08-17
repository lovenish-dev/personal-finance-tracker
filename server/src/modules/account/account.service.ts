import { AppError } from "../../utils/Apperror.js";
import { createAccount, findAccountById, findAccountByUserId, updateAccountById } from "./account.repository.js";
import type { CreateAccountBody, UpdateAccountBody } from "./account.types.js";

export async function createAccountService(userId: number, data: CreateAccountBody) {
   const result = await createAccount(userId, data)
   return result;    
}

export async function  getAccountsByUserIdService(user_id: number){
   const result = await findAccountByUserId(user_id);
   return result;
}

export async function getAccountByIdService(accId:number, userId:number){
   const result = await findAccountById(accId, userId);
   if(!result) throw new AppError("Account Not Found", 404);
   return result;
}

export async function updateAccountService(accountId:number, userId:number, data:UpdateAccountBody){
    const existingAccount = await findAccountById(accountId, userId);
    if(!existingAccount) throw new AppError("Account Not Found", 404);
    if(Object.keys(data).length === 0) throw new AppError("At least one field is required", 400);
    const updates = await updateAccountById(accountId, userId, data);
    return updates
}