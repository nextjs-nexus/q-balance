import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import type { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";

import connectionPool from "../db";
import { buildDemoDataset } from "./demo-data";
import {
  DEMO_USER_NAME,
  SHOWCASE_EMAIL,
  SHOWCASE_USER_NAME,
  getDemoConfig,
  type DemoConfig,
} from "./demo";

export type SampleAccount = "showcase" | "demo";

let resetsTableReady: Promise<void> | null = null;

// Created on demand, so a deployment needs no manual SQL step.
function ensureResetsTable(): Promise<void> {
  resetsTableReady ??= connectionPool
    .query(
      `CREATE TABLE IF NOT EXISTS demo_data_resets (
         account VARCHAR(20) NOT NULL,
         reset_at DATETIME NOT NULL,
         PRIMARY KEY (account)
       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    )
    .then(() => undefined)
    .catch((error: unknown) => {
      resetsTableReady = null;
      throw error;
    });

  return resetsTableReady;
}

async function upsertUser(connection: PoolConnection, email: string, name: string): Promise<string> {
  // Timestamps are set explicitly: tables created by Better Auth migrations have no defaults.
  // The unique email key makes the second of two simultaneous first resets update instead.
  await connection.query(
    `INSERT INTO \`user\` (id, email, \`emailVerified\`, name, \`createdAt\`, \`updatedAt\`)
     VALUES (?, ?, ?, ?, NOW(3), NOW(3))
     ON DUPLICATE KEY UPDATE \`updatedAt\` = NOW(3)`,
    [randomUUID(), email, true, name]
  );

  const [users] = await connection.query<RowDataPacket[]>(
    "SELECT id FROM `user` WHERE email = ?",
    [email]
  );
  const userId = users[0]?.id;

  if (typeof userId !== "string") {
    throw new Error(`The sample user ${email} could not be created.`);
  }

  await connection.query(
    `UPDATE \`user\`
     SET name = ?, \`emailVerified\` = ?, image = NULL, \`updatedAt\` = NOW(3),
       \`createdAt\` = IF(\`createdAt\` < '1971-01-01', NOW(3), \`createdAt\`)
     WHERE id = ?`,
    [name, true, userId]
  );

  return userId;
}

async function upsertPassword(connection: PoolConnection, userId: string, password: string): Promise<void> {
  const passwordHash = await hashPassword(password);
  const [accounts] = await connection.query<RowDataPacket[]>(
    "SELECT id FROM account WHERE `userId` = ? AND `providerId` = ?",
    [userId, "credential"]
  );

  if (accounts.length > 0) {
    await connection.query(
      "UPDATE account SET password = ?, `updatedAt` = NOW(3) WHERE `userId` = ? AND `providerId` = ?",
      [passwordHash, userId, "credential"]
    );
    return;
  }

  await connection.query(
    `INSERT INTO account (id, \`accountId\`, \`providerId\`, \`userId\`, password, \`createdAt\`, \`updatedAt\`)
     VALUES (?, ?, ?, ?, ?, NOW(3), NOW(3))`,
    [randomUUID(), userId, "credential", userId, passwordHash]
  );
}

// The showcase account must never be signed in to, so any credential or session is removed.
async function removeSignIn(connection: PoolConnection, userId: string): Promise<void> {
  await connection.query("DELETE FROM `session` WHERE `userId` = ?", [userId]);
  await connection.query("DELETE FROM account WHERE `userId` = ?", [userId]);
}

async function replaceSampleData(connection: PoolConnection, userId: string): Promise<void> {
  const dataset = buildDemoDataset();

  // Delete in foreign key order: transactions use items, items use categories.
  await connection.query("DELETE FROM transactions WHERE user_id = ?", [userId]);
  await connection.query("DELETE FROM items WHERE user_id = ?", [userId]);
  await connection.query("DELETE FROM categories WHERE user_id = ?", [userId]);

  const categoryIds = new Map<string, number>();
  for (const category of dataset.categories) {
    const [result] = await connection.query<ResultSetHeader>(
      "INSERT INTO categories (title, description, user_id) VALUES (?, ?, ?)",
      [category.title, category.description, userId]
    );
    categoryIds.set(category.key, result.insertId);
  }

  const itemIds = new Map<string, number>();
  for (const item of dataset.items) {
    const [result] = await connection.query<ResultSetHeader>(
      "INSERT INTO items (title, units, description, categoryid, user_id) VALUES (?, ?, ?, ?, ?)",
      [item.title, item.units, item.description, categoryIds.get(item.categoryKey), userId]
    );
    itemIds.set(item.key, result.insertId);
  }

  const rows = dataset.transactions.map((transaction) => [
    itemIds.get(transaction.itemKey),
    transaction.quantity,
    transaction.price,
    transaction.type,
    transaction.comments,
    transaction.createdAt,
    userId,
  ]);

  if (rows.length > 0) {
    await connection.query(
      "INSERT INTO transactions (itemid, quantity, price, type, comments, created_at, user_id) VALUES ?",
      [rows]
    );
  }
}

function accountSettings(account: SampleAccount): { email: string; name: string; demo: DemoConfig | null } {
  if (account === "showcase") {
    return { email: SHOWCASE_EMAIL, name: SHOWCASE_USER_NAME, demo: null };
  }

  const demo = getDemoConfig();
  if (!demo) {
    throw new Error("Set DEMO_USER_EMAIL and DEMO_USER_PASSWORD to use the demo account.");
  }

  return { email: demo.email, name: DEMO_USER_NAME, demo };
}

/**
 * Creates the sample user if needed and regenerates its data.
 * Without `force`, nothing happens if the data was already reset today (database clock).
 * Returns the sample user's id.
 */
export async function resetSampleAccount(account: SampleAccount, force = false): Promise<string> {
  await ensureResetsTable();
  const settings = accountSettings(account);
  const connection = await connectionPool.getConnection();

  try {
    await connection.beginTransaction();

    // Lock the account's reset row so simultaneous visitors wait instead of resetting twice.
    await connection.query(
      "INSERT IGNORE INTO demo_data_resets (account, reset_at) VALUES (?, '1970-01-01 00:00:00')",
      [account]
    );
    const [locks] = await connection.query<RowDataPacket[]>(
      "SELECT reset_at >= CURDATE() AS fresh FROM demo_data_resets WHERE account = ? FOR UPDATE",
      [account]
    );

    const userId = await upsertUser(connection, settings.email, settings.name);

    if (force || !Number(locks[0]?.fresh)) {
      if (settings.demo) {
        await upsertPassword(connection, userId, settings.demo.password);
        await connection.query(
          "DELETE FROM `session` WHERE `userId` = ? AND `expiresAt` < NOW(3)",
          [userId]
        );
      } else {
        await removeSignIn(connection, userId);
      }

      await replaceSampleData(connection, userId);
      await connection.query(
        "UPDATE demo_data_resets SET reset_at = NOW() WHERE account = ?",
        [account]
      );
    }

    await connection.commit();
    return userId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Returns the sample user's id, regenerating its data first when it was last reset before today.
 * The quick check avoids a write transaction on every request.
 */
export async function ensureFreshSampleAccount(account: SampleAccount): Promise<string> {
  await ensureResetsTable();
  const email = account === "showcase" ? SHOWCASE_EMAIL : getDemoConfig()?.email;

  if (email) {
    const [rows] = await connectionPool.query<RowDataPacket[]>(
      `SELECT users.id, resets.reset_at >= CURDATE() AS fresh
       FROM \`user\` AS users
       LEFT JOIN demo_data_resets AS resets ON resets.account = ?
       WHERE users.email = ?`,
      [account, email]
    );

    if (rows.length > 0 && Number(rows[0].fresh)) {
      return rows[0].id as string;
    }
  }

  return resetSampleAccount(account);
}
