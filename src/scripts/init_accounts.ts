import pg from "pg";
import { Account, Common } from "../models";
import "./_setup";

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

  const columnStatements = Account.TABLE_COLUMNS.map((column: Common.ColumnStruct) => {
    return Common.createColumnDef(column);
  });

  const createConstraintStatements = Account.CONSTRAINT_DEFS.map((constraint: Common.ConstraintStruct) => {
    return Common.createConstraintDef(constraint);
  });
  const alterConstraintStatements = Account.CONSTRAINT_DEFS.map((constraint: Common.ConstraintStruct) => {
    return Common.alterConstraintDef(constraint, Account.TABLE_NAME);
  });

  const query = `
    DO $$
    BEGIN
      ${Common.createIncrementSeq(Account.SEQUENCE_NAME)}
      CREATE TABLE IF NOT EXISTS ${Account.TABLE_NAME} (
        ${columnStatements.concat(createConstraintStatements).join(", ")}
      );
      ALTER TABLE ${Account.TABLE_NAME}
        ${columnStatements.map((statement: string) => {
          return `ADD COLUMN IF NOT EXISTS ${statement}`;
        }).join(", ")};
      ${alterConstraintStatements.join("")}
    END $$
  `;
  const createResult = await client.query(query);
  if (createResult) console.log(`${Account.TABLE_NAME} table created!`);
})().catch(console.error).finally(() => process.exit(0));