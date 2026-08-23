import pool from "../../config/database.js";
import type { CreateAccountBody, UpdateAccountBody } from "./account.types.js";

export async function createAccount(user_id:number, data: CreateAccountBody){
    const results = await pool.query("INSERT INTO accounts (user_id, name, type, balance) VALUES ($1, $2, $3, $4) RETURNING id, user_id, name, type, balance", [user_id, data.name, data.type, data.balance])
    return results.rows[0];
}

export async function findAccountByUserId(user_id: number){
    const results = await pool.query("SELECT id, name, type, balance FROM accounts WHERE user_id = $1 ORDER BY created_at DESC", [user_id]);
    return results.rows
}

export async function findAccountById(accountId: number, userId: number){
   const result = await pool.query("SELECT id, name, type, balance FROM accounts WHERE id = $1 AND user_id = $2", [accountId, userId]);
   return result.rows[0];
}

export async function updateAccount(accountId:number, userId:number, data: UpdateAccountBody){
    const result = await pool.query(`UPDATE accounts SET name = COALESCE($1, name), 
                                     type = COALESCE($2, type),
                                     updated_at = CURRENT_TIMESTAMP
                                     WHERE id = $3 AND user_id = $4 RETURNING id, user_id, name, type, balance, created_at, updated_at`,[data.name, data.type, accountId, userId]);
    return result.rows[0];
}

