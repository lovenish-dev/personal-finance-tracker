import pool from "../../config/database.js";
import type { PoolClient } from "pg";
import type {
  CreateTransactionBody,
  TransactionFilters,
  TransactionType,
  UpdateTransactionBody,
} from "./transaction.types.js";

export async function getAccountForTransaction(client:PoolClient, id: number, userid: number) {
  const result = await client.query(`SELECT id FROM accounts WHERE id = $1 AND user_id = $2`, [id, userid]);
  return result.rows[0];
}

export async function getCategoryForTransactions(client:PoolClient, id: number, userid: number) {
  const result = await client.query(`SELECT id FROM categories WHERE id = $1 AND user_id = $2`,[id, userid]);
  return result.rows[0];
}

export async function insertTransaction(
  client: PoolClient,
  userId: number,
  data: CreateTransactionBody
) {
  const result = await client.query(
    `INSERT INTO transactions (user_id, account_id, category_id, amount, type, description, transaction_date)
                                    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, user_id, account_id, category_id, amount, type, description, 
                                    transaction_date, created_at`,
    [
      userId,
      data.accountId,
      data.categoryId,
      data.amount,
      data.type,
      data.description,
      data.transactionDate,
    ]
  );
  return result.rows[0];
}

export async function updateAccountBalance(client: PoolClient, userId: number, data: CreateTransactionBody) {
  const result = await client.query(
    `UPDATE accounts SET balance = CASE
                                        WHEN $1 = 'income' THEN balance + $2
                                        WHEN $1 = 'expense' THEN balance - $2
                                        END, 
                                        updated_at = CURRENT_TIMESTAMP
                                        WHERE id = $3 AND user_id = $4 AND ($1 = 'income' OR balance >= $2)
                                        RETURNING id, balance`,
    [data.type, data.amount, data.accountId, userId]
  );
  return result.rows[0];
}

export async function fetchTransactionsByUserId(userId: number, filters: TransactionFilters) {
  const conditions: string[] = ["user_id = $1"];
  const values: (number | string)[] = [userId];

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const offset = (page - 1) * limit;

  if(filters.type !== undefined){
    conditions.push(`type = $${values.length + 1}`);
    values.push(filters.type)
  }
  if(filters.accountId !== undefined) {
    conditions.push(`account_id = $${values.length + 1}`);
    values.push(filters.accountId)
  }
  if(filters.categoryId !== undefined){
    conditions.push(`category_id = $${values.length + 1}`);
    values.push(filters.categoryId);
  }
  if(filters.from !== undefined){
    conditions.push(`transaction_date >= $${values.length + 1}`);
    values.push(filters.from)
  }
  
  if(filters.to !== undefined){conditions.push(`transaction_date < ($${values.length + 1}::date + INTERVAL '1 day')`); values.push(filters.to)}

  const whereClause = conditions.join(" AND ");

  const countResult = await pool.query(
    `SELECT COUNT(*)
     FROM transactions
     WHERE ${whereClause}`,
    values
  );

  const total = Number(countResult.rows[0].count);
  const limitPlaceholder = values.length + 1;
  const offsetPlaceholder = values.length + 2;

  const result = await pool.query(`SELECT id, user_id, account_id,category_id, amount, type, description, transaction_date, created_at, 
    updated_at FROM transactions WHERE ${whereClause} ORDER BY transaction_date DESC, created_at DESC LIMIT $${limitPlaceholder} OFFSET $${offsetPlaceholder}`, [...values, limit, offset]);
    const totalPages = Math.ceil(total / limit);

   return {
      transactions: result.rows,
      pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

export async function fetchTransactionByUserId(id: number, userId: number) {
  const result = await pool.query(
    `SELECT id, user_id, account_id, category_id, amount, type, description, transaction_date, created_at, updated_at
                                    FROM transactions WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  return result.rows[0];
}

export async function removeTransaction(
  client: PoolClient,
  userId: number,
  id: number
) {
  const result = await client.query(
    `DELETE from transactions WHERE id = $1 AND user_id = $2 RETURNING id, user_id, account_id,category_id, amount, type, 
                                      description, transaction_date, created_at, updated_at`,
    [id, userId]
  );
  return result.rows[0];
}

export async function reverseAccountBalance( client: PoolClient, transaction: { account_id: number; amount: number; type: TransactionType }, userId: number) {
  const result = await client.query(
    `UPDATE accounts SET balance = CASE 
                                     WHEN $1 = 'income' THEN balance - $2
                                     WHEN $1 = 'expense' THEN balance + $2
                                     END, updated_at = CURRENT_TIMESTAMP
                                     WHERE id = $3 AND user_id = $4 RETURNING id, balance`,
    [transaction.type, transaction.amount, transaction.account_id, userId]
  );
  return result.rows[0];
}

export async function getTransactionForUpdate( client: PoolClient, id: number, userId: number) {
  const result = await client.query(`SELECT id, user_id, account_id, category_id, amount, type, description, transaction_date, created_at, 
                                      updated_at FROM transactions WHERE id = $1 AND user_id = $2`, [id, userId]);
  return result.rows[0];
}

export async function modifyTransaction( client: PoolClient, id: number, userId: number, data: UpdateTransactionBody){
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (data.accountId !== undefined) {
    fields.push(`account_id = $${values.length + 1}`);
    values.push(data.accountId);
  }

  if (data.categoryId !== undefined) {
    fields.push(`category_id = $${values.length + 1}`);
    values.push(data.categoryId);
  }

  if (data.amount !== undefined) {
    fields.push(`amount = $${values.length + 1}`);
    values.push(data.amount);
  }

  if (data.type !== undefined) {
    fields.push(`type = $${values.length + 1}`);
    values.push(data.type);
  }

  if (data.description !== undefined) {
    fields.push(`description = $${values.length + 1}`);
    values.push(data.description);
  }

  if (data.transactionDate !== undefined) {
    fields.push(`transaction_date = $${values.length + 1}`);
    values.push(data.transactionDate);
  }

  values.push(id)
  values.push(userId)

  const result = await client.query(`UPDATE transactions SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
                                     WHERE id = $${values.length - 1} AND user_id = $${values.length} RETURNING id,
                                     user_id, account_id, category_id, amount, type, description, transaction_date, created_at, updated_at`, values)

   return result.rows[0]                                     
}

   