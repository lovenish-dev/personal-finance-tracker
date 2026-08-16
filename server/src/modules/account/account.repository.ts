import pool from "../../config/database.js";
import type { CreateAccountBody } from "./account.types.js";

export async function createAccount(user_id:number, data: CreateAccountBody){
    const results = await pool.query("INSERT INTO accounts (user_id, name, type, balance) VALUES ($1, $2, $3, $4) RETURNING id, user_id, name, type, balance", [user_id, data.name, data.type, data.balance])
    return results.rows[0];
}