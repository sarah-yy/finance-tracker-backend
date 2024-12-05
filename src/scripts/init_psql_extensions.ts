import pg from "pg";
import "./_setup";

const extensions = ["uuid-ossp"];

let port: number = 5432;
const envPort = parseInt(process.env.PSQL_SERVER_PORT);
if (isFinite(envPort)) {
  port = envPort;
}

const client = new pg.Client({
  user: process.env.PSQL_USER ?? "",
  password: process.env.PSQL_PASSWORD ?? "",
  host: process.env.PSQL_HOST ?? "localhost",
  port,
  database: process.env.PSQL_DATABASE ?? "test_database",
});

(async () => {
  await client.connect();

  let queryString: string = "";
  extensions.forEach((extension) => {
    queryString = `${queryString}
      CREATE EXTENSION IF NOT EXISTS "${extension}";`;
  });

  const query = `
    DO $$
    BEGIN
      ${queryString}
    END$$
  `;
  const addResult = await client.query(query);
  if (addResult) console.log("Extensions added");
})().catch(console.error).finally(() => process.exit(0));