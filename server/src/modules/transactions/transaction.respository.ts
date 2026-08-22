import pool from "../../config/database.js";
import type { PoolClient } from "pg";
import type {
  CreateTransactionBody,
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

export async function fetchTransactionsByUserId(userId: number) {
  const result = await pool.query(
    `SELECT id, user_id, account_id,category_id, amount, type, description, transaction_date, created_at, updated_at
                                    FROM transactions WHERE user_id = $1 ORDER BY transaction_date DESC, created_at DESC`,
    [userId]
  );
  return result.rows;
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
