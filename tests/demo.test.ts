import assert from "node:assert/strict";
import test from "node:test";

import {
  SHOWCASE_EMAIL,
  getDemoConfig,
  getSafeRedirectPath,
  isDemoEmail,
  isProtectedEmail,
} from "../lib/demo";
import {
  DEMO_HISTORY_DAYS,
  DEMO_ITEMS,
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
  buildDemoDataset,
} from "../lib/demo-data";

const env = {
  DEMO_USER_EMAIL: " Demo@Example.com ",
  DEMO_USER_PASSWORD: "Demo-password-123!",
};

test("the demo account is enabled only when both settings are present", () => {
  assert.deepEqual(getDemoConfig(env), { email: "demo@example.com", password: "Demo-password-123!" });
  assert.equal(getDemoConfig({ DEMO_USER_EMAIL: "demo@example.com" }), null);
  assert.equal(getDemoConfig({ DEMO_USER_PASSWORD: "secret" }), null);
  assert.equal(getDemoConfig({}), null);
});

test("demo email matching ignores case and surrounding spaces", () => {
  assert.equal(isDemoEmail("DEMO@example.com", env), true);
  assert.equal(isDemoEmail("someone@example.com", env), false);
  assert.equal(isDemoEmail(undefined, env), false);
  assert.equal(isDemoEmail("demo@example.com", {}), false);
});

test("the showcase and demo emails are protected, others are not", () => {
  assert.equal(isProtectedEmail(SHOWCASE_EMAIL, {}), true);
  assert.equal(isProtectedEmail(` ${SHOWCASE_EMAIL.toUpperCase()} `, {}), true);
  assert.equal(isProtectedEmail("demo@example.com", env), true);
  assert.equal(isProtectedEmail("someone@example.com", env), false);
});

test("demo sign-in only redirects to same-site paths", () => {
  assert.equal(getSafeRedirectPath("/list-items"), "/list-items");
  assert.equal(getSafeRedirectPath("/new-transaction?type=1"), "/new-transaction?type=1");
  assert.equal(getSafeRedirectPath("https://example.com"), "/dashboard");
  assert.equal(getSafeRedirectPath("//example.com"), "/dashboard");
  assert.equal(getSafeRedirectPath("/\\example.com"), "/dashboard");
  assert.equal(getSafeRedirectPath(null), "/dashboard");
});

test("sample transactions cover about six months and end on the given day", () => {
  const today = new Date(Date.UTC(2026, 10, 10, 15, 30));
  const { transactions } = buildDemoDataset(today);
  const dates = transactions.map((transaction) => transaction.createdAt.slice(0, 10)).sort();

  assert.ok(transactions.length > 150, `expected a busy history, got ${transactions.length} transactions`);
  assert.equal(dates.at(-1)! <= "2026-11-10", true);
  assert.equal(dates[0] >= "2026-05-11", true);
  assert.ok(new Set(dates.map((date) => date.slice(0, 7))).size >= 6);
  assert.equal(DEMO_HISTORY_DAYS >= 180, true);
});

test("sample data is deterministic per calendar day and slides forward", () => {
  const first = buildDemoDataset(new Date(Date.UTC(2026, 10, 10)));
  const again = buildDemoDataset(new Date(Date.UTC(2026, 10, 10, 23, 59)));
  const nextDay = buildDemoDataset(new Date(Date.UTC(2026, 10, 11)));

  assert.deepEqual(first, again);

  const sharedDay = (dataset: typeof first) =>
    dataset.transactions.filter((transaction) => transaction.createdAt.startsWith("2026-10-15"));
  assert.deepEqual(sharedDay(first), sharedDay(nextDay));
});

test("sample transactions reference known items with valid amounts", () => {
  const itemKeys = new Set(DEMO_ITEMS.map((item) => item.key));
  const { transactions } = buildDemoDataset(new Date(Date.UTC(2026, 10, 10)));

  for (const transaction of transactions) {
    assert.ok(itemKeys.has(transaction.itemKey), transaction.itemKey);
    assert.ok(transaction.quantity > 0);
    assert.ok(transaction.price > 0);
    assert.match(transaction.createdAt, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:00$/);
  }
});

test("sample income is higher than expenses, with a salary every month", () => {
  const { transactions } = buildDemoDataset(new Date(Date.UTC(2026, 10, 10)));
  const total = (type: number) => transactions
    .filter((transaction) => transaction.type === type)
    .reduce((sum, transaction) => sum + transaction.quantity * transaction.price, 0);

  assert.ok(total(TRANSACTION_TYPE_INCOME) > total(TRANSACTION_TYPE_EXPENSE));
  assert.ok(total(TRANSACTION_TYPE_EXPENSE) > 0);
  assert.ok(transactions.filter((transaction) => transaction.itemKey === "salary").length >= 6);
});
