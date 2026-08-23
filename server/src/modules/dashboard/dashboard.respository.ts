import pool from "../../config/database.js";

export async function fetchDashboardSummary(userId: number) {
  const result = await pool.query(`SELECT COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
                                 COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expense,
                                 COUNT(*) AS transaction_count FROM transactions WHERE user_id = $1`, [userId]);
  return result.rows[0]    
}

export async function fetchCategorySummary(userId: number){
  const result = await pool.query(`SELECT c.name AS category, t.type, SUM(t.amount) AS total FROM transactions t JOIN categories c
                                   ON t.category_id = c.id WHERE t.user_id = $1 GROUP BY c.name, t.type ORDER BY total DESC`, [userId]);
  return result.rows; 
}