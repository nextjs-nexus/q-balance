import { createPool } from "mysql2/promise";

const connectionPool = createPool({
  host: process.env.MYSQL_HOST ?? "127.0.0.1",
  port: Number(process.env.MYSQL_PORT ?? 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE ?? "q_balance",
  waitForConnections: true,
  connectionLimit: 10,
});

export default connectionPool;
