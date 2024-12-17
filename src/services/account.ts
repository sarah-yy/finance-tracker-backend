import pool from "../config/database";
import * as Account from "@fin-tracker/models/account";
import * as Query from "@fin-tracker/util/query";

const getAllAccounts = async (): Promise<Account.Account[]> => {
  const { rows } = await pool.query("SELECT * FROM accounts");
  return rows;
};

const getAccountByUsername = async (username: string): Promise<Account.Account | undefined> => {
  const { rows } = await pool.query(`SELECT * FROM accounts WHERE account_username = '${username}'`);
  if (rows.length === 0) {
    return undefined;
  }
  const newEntry = rows[0];
  return processAccountData(newEntry);
};

const createNewAccount = async (newAccount: Account.SubmitRegisterObj): Promise<Account.Account> => {
  const addAccountResult = await pool.query(Query.getCreateEntryQuery({
    values: (newAccount as unknown) as Query.CreateEntryValuesObj,
    tableName: Account.TABLE_NAME,
    returnValues: Account.accountReturnFields,
  }));
  if (addAccountResult.rows.length === 0) {
    throw new Error("create account failed, pls contact devs");
  }
  const newEntry = addAccountResult.rows[0];
  return processAccountData(newEntry);
};

// Utils functions
const processAccountData = (entry: any) => {
  return {
    accountId: entry.account_id,
    accountUsername: entry.account_username,
    passwordHash: entry.password_hash,
    email: entry.email,
    createdAt: entry.created_at,
    isAdmin: entry.is_admin,
  };
};

export default { createNewAccount, getAccountByUsername, getAllAccounts };