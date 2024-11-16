import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config();

let port: number = 5432;
const envPort = parseInt(process.env.PSQL_SERVER_PORT);
if (isFinite(envPort)) {
  port = envPort;
}

const database = process.env.PSQL_DATABASE ?? "test_database";

const pool = new Pool({
  user: process.env.PSQL_USER ?? "",
  host: process.env.PSQL_HOST ?? "localhost",
  database,
  password: process.env.PSQL_PASSWORD ?? "",
  port,
});

export default pool;