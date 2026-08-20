import pool from "../../config/database.js";
import { AppError } from "../../utils/Apperror.js";
import { fetchTransactionByUserId, fetchTransactionsByUserId, getAccountForTransaction, getCategoryForTransactions, insertTransaction, updateAccountBalance } from "./transaction.respository.js";
import type { CreateTransactionBody } from "./transaction.types.js";

export async function createTransactionService( userId: number, data:CreateTransactionBody){
   const accountOwnership = await getAccountForTransaction(data.accountId, userId);
   if(!accountOwnership) throw new AppError("Account Not Found", 404);
   const categoryOwnership = await getCategoryForTransactions(data.categoryId, userId);
   if(!categoryOwnership) throw new AppError("Category Not Found", 404);

   const client = await pool.connect();
   try{
    await client.query("BEGIN");
    const transaction = await insertTransaction(client, userId, data);
    const updateBalance = await updateAccountBalance(client, userId, data);
    if(!updateBalance) throw new AppError("Insufficient account balance", 400);
    await client.query("COMMIT");
    return transaction
   }catch(err){
    await client.query("ROLLBACK")
    throw err
   } finally {
      client.release();
   }
}

export async function getTransactionsByUserIdService(userId: number){
   const result = await fetchTransactionsByUserId(userId);
   return result
}

export async function getTransactionByUserIdService(id: number, userId: number){
   const result = await fetchTransactionByUserId(id, userId)
   if(!result) throw new AppError("Transaction not found", 404)
   return result
}