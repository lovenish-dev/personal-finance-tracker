import pool from "../../config/database.js";
import type { CreateCategoryBody, UpdateCategoryBody } from "./category.types.js";

export async function insertCategory(userId: number, data: CreateCategoryBody){
     const result = await pool.query(`INSERT INTO categories (user_id, name, type) VALUES ($1, $2, $3) 
                                      RETURNING id, user_id, name, type, created_at, updated_at`, [userId, data.name, data.type]);
     return result.rows[0];
}

export async function fetchCategoriesByuserId(userId: number){
     const result = await pool.query(`SELECT id, user_id, name, type, created_at, updated_at
                                      FROM categories WHERE user_id = $1 ORDER BY created_at DESC`, [userId]);
     return result.rows
}

export async function fetchCategoryById(userId: number, id: number){
     const result = await pool.query(`SELECT id, user_id, name, type, created_at, updated_at FROM
                                      categories WHERE user_id = $1 AND id = $2`, [userId, id]);
     return result.rows[0];
}

export async function  modifyCategory(id:number, userId:number, data: UpdateCategoryBody){
    const field: string[] = []
    const values: (string | number)[] = []

    if(data.name !== undefined){
      field.push(`name = $${values.length + 1}`);
      values.push(data.name);
    }

    if(data.type !== undefined){
     field.push(`type = $${values.length + 1}`);
     values.push(data.type)
    }

    values.push(id)
    values.push(userId)

    const result = await pool.query(`UPDATE categories SET ${field.join(", ")}, updated_at = CURRENT_TIMESTAMP
                                     WHERE id = $${values.length - 1} AND user_id = $${values.length} RETURNING
                                     id, user_id, name, type, created_at, updated_at`, values);
    return result.rows[0]

}

export async function removeCategory(id:number, userId:number){
     const result = await pool.query(`DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING id, user_id, name, type`, [id, userId]);
     return result.rows[0]
}