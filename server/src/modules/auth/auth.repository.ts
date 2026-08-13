import pool from "../../config/database.js";
import type { RegisterBody } from "./auth.types.js";

export async function findUserByEmail(email: string){
   const result = await pool.query("SELECT id, name, email, password FROM users WHERE email = $1", [email]);
    return result.rows[0]
}

export async function CreateUser(user: RegisterBody, hashedPassword: string){
    const result = await pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at", [user.name, user.email, hashedPassword]);
    return result.rows[0];
}