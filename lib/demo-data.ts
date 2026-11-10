// Generates realistic sample data for the showcase and demo accounts.
// Pure and deterministic: each calendar date always produces the same transactions,
// so the data slides forward day by day instead of changing on every reset.

export const DEMO_HISTORY_DAYS = 183;

export const TRANSACTION_TYPE_INCOME = 1;
export const TRANSACTION_TYPE_EXPENSE = 2;

export type DemoCategory = {
  key: string;
  title: string;
  description: string;
};

export type DemoItem = {
  key: string;
  categoryKey: string;
  title: string;
  units: string;
  description: string;
};

export type DemoTransaction = {
  itemKey: string;
  type: typeof TRANSACTION_TYPE_INCOME | typeof TRANSACTION_TYPE_EXPENSE;
  quantity: number;
  price: number;
  comments: string;
  createdAt: string;
};

export type DemoDataset = {
  categories: DemoCategory[];
  items: DemoItem[];
  transactions: DemoTransaction[];
};

export const DEMO_CATEGORIES: DemoCategory[] = [
  { key: "income", title: "Income", description: "Salary, freelance work, and interest." },
  { key: "housing", title: "Housing", description: "Rent and home insurance." },
  { key: "utilities", title: "Utilities", description: "Electricity, water, internet, and phone." },
  { key: "groceries", title: "Groceries", description: "Supermarket shopping and fresh produce." },
  { key: "transport", title: "Transport", description: "Fuel, public transport, and car service." },
  { key: "leisure", title: "Leisure", description: "Eating out, cinema, books, and streaming." },
  { key: "health", title: "Health", description: "Gym membership and pharmacy." },
];

export const DEMO_ITEMS: DemoItem[] = [
  { key: "salary", categoryKey: "income", title: "Salary", units: "month", description: "Monthly net salary." },
  { key: "freelance", categoryKey: "income", title: "Freelance project", units: "project", description: "Web development side projects." },
  { key: "interest", categoryKey: "income", title: "Savings interest", units: "month", description: "Interest from the savings account." },
  { key: "rent", categoryKey: "housing", title: "Rent", units: "month", description: "Apartment rent." },
  { key: "insurance", categoryKey: "housing", title: "Home insurance", units: "month", description: "Contents and liability insurance." },
  { key: "electricity", categoryKey: "utilities", title: "Electricity", units: "kWh", description: "Monthly electricity bill." },
  { key: "water", categoryKey: "utilities", title: "Water", units: "m³", description: "Monthly water bill." },
  { key: "internet", categoryKey: "utilities", title: "Internet", units: "month", description: "Home fibre connection." },
  { key: "phone", categoryKey: "utilities", title: "Mobile phone", units: "month", description: "Mobile phone plan." },
  { key: "supermarket", categoryKey: "groceries", title: "Supermarket", units: "purchase", description: "Weekly grocery shopping." },
  { key: "produce", categoryKey: "groceries", title: "Fresh produce", units: "kg", description: "Fruit and vegetables from the market." },
  { key: "coffee", categoryKey: "groceries", title: "Coffee beans", units: "kg", description: "Freshly roasted coffee." },
  { key: "fuel", categoryKey: "transport", title: "Fuel", units: "litre", description: "Petrol for the car." },
  { key: "ticket", categoryKey: "transport", title: "Public transport ticket", units: "ticket", description: "Single city ticket." },
  { key: "car-service", categoryKey: "transport", title: "Car service", units: "service", description: "Scheduled car maintenance." },
  { key: "restaurant", categoryKey: "leisure", title: "Restaurant", units: "visit", description: "Dinner or lunch out." },
  { key: "cinema", categoryKey: "leisure", title: "Cinema", units: "ticket", description: "Cinema tickets." },
  { key: "books", categoryKey: "leisure", title: "Books", units: "book", description: "Books and e-books." },
  { key: "streaming", categoryKey: "leisure", title: "Streaming subscription", units: "month", description: "Video streaming service." },
  { key: "gym", categoryKey: "health", title: "Gym membership", units: "month", description: "Monthly gym pass." },
  { key: "pharmacy", categoryKey: "health", title: "Pharmacy", units: "purchase", description: "Medicine and vitamins." },
];

type Random = () => number;

// Small seeded generator (mulberry32), good enough for sample data.
function createRandom(seed: number): Random {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(text: string): number {
  let hash = 2166136261;

  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function between(random: Random, min: number, max: number, decimals = 2): number {
  const factor = 10 ** decimals;

  return Math.round((min + random() * (max - min)) * factor) / factor;
}

function pick<T>(random: Random, values: T[]): T {
  return values[Math.floor(random() * values.length)];
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function formatDate(date: Date): string {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

function daysInMonth(date: Date): number {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
}

function transactionsForDay(date: Date): DemoTransaction[] {
  const day = formatDate(date);
  const month = day.slice(0, 7);
  const dayOfMonth = date.getUTCDate();
  const weekday = date.getUTCDay();
  const random = createRandom(hashString(day));
  const monthRandom = createRandom(hashString(month));
  const result: DemoTransaction[] = [];

  function add(
    itemKey: string,
    type: DemoTransaction["type"],
    quantity: number,
    price: number,
    comments: string
  ) {
    const hour = 8 + Math.floor(random() * 12);
    const minute = Math.floor(random() * 60);

    result.push({
      itemKey,
      type,
      quantity,
      price,
      comments,
      createdAt: `${day} ${pad(hour)}:${pad(minute)}:00`,
    });
  }

  const income = TRANSACTION_TYPE_INCOME;
  const expense = TRANSACTION_TYPE_EXPENSE;

  // Fixed monthly income and bills.
  if (dayOfMonth === 1) {
    add("rent", expense, 1, 850, "Monthly rent");
  }

  if (dayOfMonth === 5) {
    add("internet", expense, 1, 29.99, "Fibre 500 Mb/s");
    add("phone", expense, 1, 14.99, "Mobile plan");
    add("streaming", expense, 1, 12.99, "Streaming subscription");
    add("gym", expense, 1, 39, "Monthly gym pass");
    add("insurance", expense, 1, 18.5, "Home insurance");
  }

  if (dayOfMonth === 10) {
    add("electricity", expense, between(random, 170, 320, 0), 0.21, "Electricity bill");
    add("water", expense, between(random, 6, 10, 0), 2.4, "Water bill");
  }

  if (dayOfMonth === 25) {
    add("salary", income, 1, 2850, "Monthly salary");
  }

  if (dayOfMonth === daysInMonth(date)) {
    add("interest", income, 1, between(random, 3, 9), "Savings interest");
  }

  // One freelance project in most months, on a day picked per month.
  const hasFreelance = monthRandom() < 0.65;
  const freelanceDay = 8 + Math.floor(monthRandom() * 13);
  const freelanceAmount = Math.round(between(monthRandom, 350, 1200, 0) / 50) * 50;

  if (hasFreelance && dayOfMonth === freelanceDay) {
    add("freelance", income, 1, freelanceAmount, pick(random, [
      "Landing page for a local bakery",
      "Next.js dashboard fixes",
      "Website maintenance",
      "Online shop improvements",
    ]));
  }

  // One car service in the six-month window.
  if (dayOfMonth === 14 && monthRandom() < 0.2) {
    add("car-service", expense, 1, between(random, 180, 320, 0), "Oil change and inspection");
  }

  // Everyday spending.
  if (weekday === 6) {
    add("supermarket", expense, 1, between(random, 48, 115), "Weekly shopping");
  }

  if (weekday === 3) {
    add("produce", expense, between(random, 1.5, 4, 1), between(random, 2.8, 4.5), "Market fruit and vegetables");
  }

  if (random() < 0.05) {
    add("coffee", expense, 1, 14.9, "Coffee beans");
  }

  if (random() < 0.1) {
    add("fuel", expense, between(random, 35, 50, 0), between(random, 1.55, 1.75), "Fuel");
  }

  if (weekday >= 1 && weekday <= 5 && random() < 0.3) {
    add("ticket", expense, random() < 0.5 ? 1 : 2, 1.5, "City ticket");
  }

  if ((weekday === 5 || weekday === 6) && random() < 0.5) {
    add("restaurant", expense, 1, between(random, 22, 68), pick(random, [
      "Dinner with friends",
      "Pizza night",
      "Lunch out",
      "Sushi dinner",
    ]));
  }

  if (random() < 0.06) {
    add("cinema", expense, random() < 0.5 ? 1 : 2, 9.5, "Cinema tickets");
  }

  if (random() < 0.035) {
    add("books", expense, 1, between(random, 12, 28), "New book");
  }

  if (random() < 0.035) {
    add("pharmacy", expense, 1, between(random, 6, 35), "Pharmacy");
  }

  return result;
}

/**
 * Builds the sample categories, items, and about six months of transactions ending on `today` (UTC).
 */
export function buildDemoDataset(today: Date = new Date()): DemoDataset {
  const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const transactions: DemoTransaction[] = [];

  for (let offset = DEMO_HISTORY_DAYS - 1; offset >= 0; offset--) {
    const date = new Date(end);
    date.setUTCDate(end.getUTCDate() - offset);
    transactions.push(...transactionsForDay(date));
  }

  return {
    categories: DEMO_CATEGORIES,
    items: DEMO_ITEMS,
    transactions,
  };
}
