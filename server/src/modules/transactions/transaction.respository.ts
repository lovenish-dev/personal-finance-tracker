import pool from "../../config/database.js";
import type { PoolClient } from "pg";
import type { CreateTransactionBody } from "./transaction.types.js";

export async function getAccountForTransaction(id: number, userid: number){
   const result = await pool.query(`SELECT id FROM accounts WHERE id = $1 AND user_id = $2`,[id, userid]);
   return result.rows[0]
}

export async function getCategoryForTransactions(id:number, userid:number){
   const result = await pool.query(`SELECT id FROM categories WHERE id = $1 AND user_id = $2`,[id, userid]);
   return result.rows[0]
}

export async function insertTransaction(client: PoolClient ,userId: number, data:CreateTransactionBody){
    const result = await client.query(`INSERT INTO transactions (user_id, account_id, category_id, amount, type, description, transaction_date)
                                    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, user_id, account_id, category_id, amount, type, description, 
                                    transaction_date, created_at`, [userId, data.accountId, data.categoryId, data.amount, data.type, data.description, data.transactionDate]);
    return result.rows[0];
}

export async function updateAccountBalance(client:PoolClient, userId: number, data: CreateTransactionBody){
     const result = await client.query(`UPDATE accounts SET balance = CASE
                                        WHEN $1 = 'income' THEN balance + $2
                                        WHEN $1 = 'expense' THEN balance - $2
                                        END, 
                                        updated_at = CURRENT_TIMESTAMP
                                        WHERE id = $3 AND user_id = $4 AND ($1 = 'income' OR balance >= $2)
                                        RETURNING id, balance`,[data.type, data.amount, data.accountId, userId]);
      return result.rows[0]
}