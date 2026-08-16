import { createAccount, getAccountByUserId } from "./account.repository.js";
import type { CreateAccountBody } from "./account.types.js";

export async function createAccountService(userId: number, data: CreateAccountBody) {
   const result = await createAccount(userId, data)
   return result;    
}

export async function  getAccountsByUserIdService(user_id: number){
   const result = await getAccountByUserId(user_id);
   return result;
}