import pool from "../config/database";
import * as Account from "@fin-tracker/models/account";
import * as Query from "@fin-tracker/util/query";

const getAllAccounts = async (): Promise<Account.Account[]> => {
  const { rows } = await pool.query("SELECT * FROM accounts");
  return rows;
};

const createNewAccount = async (newAccount: Account.SubmitRegisterObj): Promise<Account.Account> => {
  const addAccountResult = await pool.query(Query.getCreateEntryQuery({
    values: (newAccount as unknown) as Query.CreateEntryValuesObj,
    tableName: Account.TABLE_NAME,
    returnValues: Account.accountReturnFields,
  }));
  if (addAccountResult.rows.length === 0) {
    throw new Error("create query failed, pls contact devs");
  }
  const newEntry = addAccountResult.rows[0];
  return {
    accountId: newEntry.account_id,
    accountUsername: newEntry.account_username,
    passwordHash: newEntry.password_hash,
    email: newEntry.email,
    createdAt: newEntry.created_at,
    isAdmin: newEntry.is_admin,
  };
};

export default { createNewAccount, getAllAccounts };