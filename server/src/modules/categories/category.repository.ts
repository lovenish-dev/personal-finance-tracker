import pool from "../../config/database.js";
import type { CreateCategoryBody } from "./category.types.js";

export async function insertCategory(userId: number, data: CreateCategoryBody){
     const result = await pool.query(`INSERT INTO categories (user_id, name, type) VALUES ($1, $2, $3) RETURNING id, user_id, name, type, created_at, updated_at`, [userId, data.name, data.type]);
     return result.rows[0];
}