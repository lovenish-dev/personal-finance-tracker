import pool from "../../config/database.js";
import { AppError } from "../../utils/Apperror.js";
import { fetchTransactionByUserId, fetchTransactionsByUserId, getAccountForTransaction, getCategoryForTransactions, getTransactionForUpdate, insertTransaction, modifyTransaction, removeTransaction, reverseAccountBalance, updateAccountBalance } from "./transaction.respository.js";
import type { CreateTransactionBody, TransactionFilters, UpdateTransactionBody } from "./transaction.types.js";

export async function createTransactionService( userId: number, data:CreateTransactionBody){
   
   const client = await pool.connect();
   try{
    await client.query("BEGIN");
    const accountOwnership = await getAccountForTransaction(client, data.accountId, userId);
    if(!accountOwnership) throw new AppError("Account Not Found", 404);
    const categoryOwnership = await getCategoryForTransactions(client, data.categoryId, userId);
    if(!categoryOwnership) throw new AppError("Category Not Found", 404);
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

export async function getTransactionsByUserIdService(userId: number, filters: TransactionFilters){
   const result = await fetchTransactionsByUserId(userId, filters);
   return result
}

export async function getTransactionByUserIdService(id: number, userId: number){
   const result = await fetchTransactionByUserId(id, userId)
   if(!result) throw new AppError("Transaction not found", 404)
   return result
}

export async function deleteTransactionService(userId: number, id: number){
   const client = await pool.connect();
   try{
    await client.query("BEGIN");
    const deletedTransaction = await removeTransaction(client, userId, id);
    if(!deletedTransaction) throw new AppError("Transaction not found", 404);
    const reversingBalance = await reverseAccountBalance(client, deletedTransaction, userId)
    if(!reversingBalance) throw new AppError("Balance could not be reversed", 500);
    await client.query("COMMIT")
    return { deletedTransaction, reversingBalance }
   }catch(err){
      await client.query("ROLLBACK")
      throw err
   } finally {
      client.release()
   }
}

export async function updateTransactionService(userId: number, id: number, data:UpdateTransactionBody){
   if(Object.keys(data).length === 0) throw new AppError("At least one field is required", 400);
   const client = await pool.connect();
   try{
   await client.query("BEGIN");
   const oldTransaction = await getTransactionForUpdate(client, id, userId);
   if(!oldTransaction) throw new AppError("Transaction not found", 404);
   await reverseAccountBalance(client, oldTransaction, userId);
   const newAccountId = data.accountId ?? oldTransaction.account_id;
   const newCategoryId = data.categoryId ?? oldTransaction.category_id;
   const accountOwnership = await getAccountForTransaction(client, newAccountId, userId)
   if(!accountOwnership) throw new AppError("Account not found", 404);
   const categoryOwnership = await getCategoryForTransactions(client, newCategoryId, userId);
   if(!categoryOwnership) throw new AppError("Category not found", 404);
   const newTransaction = { ...oldTransaction, ...data, account_id: newAccountId, category_id: newCategoryId }
   const updateBalance = await updateAccountBalance(client, userId, {accountId: newAccountId, categoryId: newCategoryId, amount: newTransaction.amount, type: newTransaction.type, description: newTransaction.description, transactionDate:newTransaction.transaction_date})
   if(!updateBalance) throw new AppError("Insufficient account balance", 500);
   const updatedTransaction = await modifyTransaction(client,id, userId, {accountId: newAccountId, categoryId: newCategoryId, amount: newTransaction.amount, type: newTransaction.type, description: newTransaction.description, transactionDate:newTransaction.transaction_date});
   if(!updatedTransaction) throw new AppError("Transaction update failed", 500);
   await client.query("COMMIT");
   return { transaction: updatedTransaction, account: updateBalance }
   }catch(err){
   await client.query("ROLLBACK");
   throw err
   } finally {
   client.release();
   }
}