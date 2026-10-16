import type { ResultSetHeader } from "mysql2";

import connectionPool from "../db";
import { getCurrentUserId } from "./current-user";

async function select(sql: string, values: any[] = []): Promise<any[]> {
  const [rows] = await connectionPool.execute(sql, values);
  return rows as any[];
}

async function execute(sql: string, values: any[] = []): Promise<ResultSetHeader> {
  const [result] = await connectionPool.execute<ResultSetHeader>(sql, values);
  return result;
}

export async function getCategories() {
  const userId = await getCurrentUserId();
  return select(
    "SELECT id, title, description FROM categories WHERE user_id = ? ORDER BY title ASC",
    [userId]
  );
}

export async function getCategory(categoryId: FormDataEntryValue | null) {
  const userId = await getCurrentUserId();
  return select(
    "SELECT id, title, description FROM categories WHERE id = ? AND user_id = ? LIMIT 1",
    [categoryId, userId]
  );
}

export async function storeCategory(category: { title: string; description: string }) {
  const userId = await getCurrentUserId();
  const result = await execute(
    "INSERT INTO categories (title, description, user_id) VALUES (?, ?, ?)",
    [category.title, category.description, userId]
  );
  return { id: result.insertId };
}

export async function storeEditCategory(id: FormDataEntryValue | null, category: { title: string; description: string }) {
  const userId = await getCurrentUserId();
  await execute(
    "UPDATE categories SET title = ?, description = ? WHERE id = ? AND user_id = ?",
    [category.title, category.description, id, userId]
  );
  return { id };
}

export async function deleteCategory(id: FormDataEntryValue | null) {
  const userId = await getCurrentUserId();
  await execute("DELETE FROM categories WHERE id = ? AND user_id = ?", [id, userId]);
  return { id };
}

export async function getItems() {
  const userId = await getCurrentUserId();
  return select(
    "SELECT id, title, units, description FROM items WHERE user_id = ? ORDER BY title ASC",
    [userId]
  );
}

export async function getItem(itemId: FormDataEntryValue | null) {
  const userId = await getCurrentUserId();
  return select(
    "SELECT id, title, units, description, categoryid FROM items WHERE id = ? AND user_id = ? LIMIT 1",
    [itemId, userId]
  );
}

export async function storeItem(item: {
  title: string;
  units: string;
  description: string;
  categoryId: string | number;
}) {
  const userId = await getCurrentUserId();
  const result = await execute(
    `INSERT INTO items (title, units, description, categoryid, user_id)
     SELECT ?, ?, ?, cat.id, ?
     FROM categories AS cat
     WHERE cat.id = ? AND cat.user_id = ?`,
    [item.title, item.units, item.description, userId, item.categoryId, userId]
  );
  return { id: result.insertId };
}

export async function storeEditItem(
  id: FormDataEntryValue | null,
  item: { title: string; units: string; description: string; categoryId: string | number }
) {
  const userId = await getCurrentUserId();
  await execute(
    `UPDATE items
     SET title = ?, units = ?, description = ?, categoryid = ?
     WHERE id = ? AND user_id = ?
       AND EXISTS (SELECT 1 FROM categories WHERE categories.id = ? AND categories.user_id = ?)`,
    [item.title, item.units, item.description, item.categoryId, id, userId, item.categoryId, userId]
  );
  return { id };
}

export async function deleteItem(id: FormDataEntryValue | null) {
  const userId = await getCurrentUserId();
  await execute("DELETE FROM items WHERE id = ? AND user_id = ?", [id, userId]);
  return { id };
}

export async function getTransactions(
  dateFrom?: string,
  dateTo?: string,
  categoryId?: string | number,
  type?: string | number,
  limit?: number,
  sorting?: string
) {
  const userId = await getCurrentUserId();
  const sortDirection = String(sorting).trim().toUpperCase() === "DESC" ? "DESC" : "ASC";

  const normalizedLimit = limit && limit > 0 ? limit : null;
  if (!type || Number(type) === 0) type = 2;

  if (!dateFrom) {
    const dateObj = new Date();
    dateObj.setMonth(dateObj.getMonth() - 1);
    dateFrom = dateObj.toJSON().slice(0, 10);
  }
  if (!dateTo) dateTo = new Date().toJSON().slice(0, 10);

  const criteria: any[] = [dateFrom + " 00:00:01", dateTo + " 23:59:59", type, userId];
  let categoryCriteria = "";
  if (categoryId && Number(categoryId) !== 0) {
    criteria.push(categoryId);
    categoryCriteria = "AND itm.categoryid = ?";
  }

  const limitClause = normalizedLimit ? "LIMIT ?" : "";
  if (normalizedLimit) criteria.push(normalizedLimit);

  return select(
    `SELECT tra.id, tra.price, tra.quantity, itm.title,
       DATE_FORMAT(tra.created_at, '%Y-%m-%d') AS date
     FROM transactions AS tra
     JOIN items AS itm ON itm.id = tra.itemid AND itm.user_id = tra.user_id
     WHERE tra.created_at BETWEEN ? AND ?
       AND tra.type = ? AND tra.user_id = ? ${categoryCriteria}
     ORDER BY tra.created_at ${sortDirection}, itm.title ${sortDirection}
     ${limitClause}`,
    criteria
  );
}

export async function getTransaction(transactionId: FormDataEntryValue | null) {
  const userId = await getCurrentUserId();
  return select(
    "SELECT id, itemid, quantity, price, comments FROM transactions WHERE id = ? AND user_id = ?",
    [transactionId, userId]
  );
}

export async function getByCategories(dateFrom?: string, dateTo?: string, categoryId?: string) {
  const userId = await getCurrentUserId();
  if (!dateFrom) {
    const dateObj = new Date();
    dateObj.setMonth(dateObj.getMonth() - 1);
    dateFrom = dateObj.toJSON().slice(0, 10);
  }
  if (!dateTo) dateTo = new Date().toJSON().slice(0, 10);

  const criteria: any[] = [dateFrom + " 00:00:01", dateTo + " 23:59:59", userId];
  let categoryCriteria = "";
  if (categoryId && Number(categoryId) !== 0) {
    criteria.push(categoryId);
    categoryCriteria = "AND itm.categoryid = ?";
  }

  return select(
    `SELECT cat.id, cat.title,
       SUM(CASE WHEN tra.type = 1 THEN tra.price * tra.quantity ELSE 0 END) AS income,
       SUM(CASE WHEN tra.type = 2 THEN tra.price * tra.quantity ELSE 0 END) AS expense
     FROM transactions AS tra
     JOIN items AS itm ON itm.id = tra.itemid AND itm.user_id = tra.user_id
     JOIN categories AS cat ON cat.id = itm.categoryid AND cat.user_id = tra.user_id
     WHERE tra.created_at BETWEEN ? AND ? AND tra.user_id = ? ${categoryCriteria}
     GROUP BY cat.id, cat.title
     ORDER BY cat.title ASC`,
    criteria
  );
}

export async function getByDays(dateFrom?: string, dateTo?: string) {
  const userId = await getCurrentUserId();
  if (!dateFrom) {
    const dateObj = new Date();
    dateObj.setMonth(dateObj.getMonth() - 1);
    dateFrom = dateObj.toJSON().slice(0, 10);
  }
  if (!dateTo) dateTo = new Date().toJSON().slice(0, 10);

  return select(
    `SELECT DATE_FORMAT(tra.created_at, '%m-%d') AS day,
       ROUND(SUM(CASE WHEN tra.type = 1 THEN tra.price * tra.quantity ELSE 0 END) * 100) / 100 AS income,
       ROUND(SUM(CASE WHEN tra.type = 2 THEN tra.price * tra.quantity ELSE 0 END) * 100) / 100 AS expense
     FROM transactions AS tra
     JOIN items AS itm ON itm.id = tra.itemid AND itm.user_id = tra.user_id
     JOIN categories AS cat ON cat.id = itm.categoryid AND cat.user_id = tra.user_id
     WHERE tra.created_at BETWEEN ? AND ? AND tra.user_id = ?
     GROUP BY DATE_FORMAT(tra.created_at, '%m-%d')
     ORDER BY DATE_FORMAT(tra.created_at, '%m-%d')`,
    [dateFrom + " 00:00:01", dateTo + " 23:59:59", userId]
  );
}

export async function storeTransaction(transaction: {
  itemId: string | number;
  quantity: string | number;
  price: string | number;
  type: string | number;
  comments: string;
}) {
  const userId = await getCurrentUserId();
  const result = await execute(
    `INSERT INTO transactions (itemid, quantity, price, type, comments, user_id)
     SELECT itm.id, ?, ?, ?, ?, ?
     FROM items AS itm
     WHERE itm.id = ? AND itm.user_id = ?`,
    [
      transaction.quantity,
      transaction.price,
      transaction.type,
      transaction.comments,
      userId,
      transaction.itemId,
      userId,
    ]
  );
  return { id: result.insertId };
}

export async function storeEditTransaction(
  id: FormDataEntryValue | null,
  transaction: { itemId: string | number; quantity: string | number; price: string | number; comments: string }
) {
  const userId = await getCurrentUserId();
  await execute(
    `UPDATE transactions
     SET itemid = ?, quantity = ?, price = ?, comments = ?
     WHERE id = ? AND user_id = ?
       AND EXISTS (SELECT 1 FROM items WHERE items.id = ? AND items.user_id = ?)`,
    [
      transaction.itemId,
      transaction.quantity,
      transaction.price,
      transaction.comments,
      id,
      userId,
      transaction.itemId,
      userId,
    ]
  );
  return { id };
}

export async function deleteTransaction(id: FormDataEntryValue | null) {
  const userId = await getCurrentUserId();
  await execute("DELETE FROM transactions WHERE id = ? AND user_id = ?", [id, userId]);
  return { id };
}
