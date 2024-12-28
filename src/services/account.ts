import pool from "../config/database";
import * as Account from "@fin-tracker/models/account";
import * as Query from "@fin-tracker/util/query";

const getAllAccounts = async (): Promise<Account.Account[]> => {
  const { rows } = await pool.query(Query.getSelectQuery({
    tableName: Account.TABLE_NAME,
  }));
  return rows;
};

const getAccountByUsername = async (username: string, includeInactive: boolean = false): Promise<Account.Account | undefined> => {
  const { rows } = await pool.query(Query.getSelectQuery({
    tableName: Account.TABLE_NAME,
    whereCondition: `account_username = '${username}'${getInactiveCondition(includeInactive)}`,
  }));
  if (rows.length === 0) {
    return undefined;
  }
  const newEntry = rows[0];
  return processAccountData(newEntry);
};

const getAccountById = async (id: string, includeInactive: boolean = false): Promise<Account.Account | undefined> => {
  const { rows } = await pool.query(Query.getSelectQuery({
    tableName: Account.TABLE_NAME,
    whereCondition: `account_id = '${id}'${getInactiveCondition(includeInactive)}`,
  }));
  if (rows.length === 0) {
    return undefined;
  }
  const newEntry = rows[0];
  return processAccountData(newEntry);
};

const createNewAccount = async (newAccount: Account.SubmitRegisterObj): Promise<Account.Account> => {
  const addAccountResult = await pool.query(Query.getCreateEntryQuery({
    values: (newAccount as unknown) as Query.EntryValuesObj,
    tableName: Account.TABLE_NAME,
    returnValues: Account.accountReturnFields,
  }));
  if (addAccountResult.rows.length === 0) {
    throw new Error("create account failed, pls contact devs");
  }
  const newEntry = addAccountResult.rows[0];
  return processAccountData(newEntry);
};

const editAccountDetails = async (updateAccount: Account.SubmitEditObj): Promise<Account.Account> => {
  const { account_username, password_hash, email } = updateAccount;
  const params = { account_username, password_hash, email };
  const editAccountResult = await pool.query(Query.getUpdateEntryQuery({
    values: params as Query.EntryValuesObj,
    tableName: Account.TABLE_NAME,
    returnValues: Account.accountReturnFields,
    whereCondition: `account_id = '${updateAccount.account_id}'`,
  }));
  if (editAccountResult.rows.length === 0) {
    throw new Error("edit account failed, pls contact devs");
  }
  const updateEntry = editAccountResult.rows[0];
  return processAccountData(updateEntry);
};

const deleteAccount = async (deleteAccount: Account.SubmitToggleDeleteObj): Promise<Account.Account> => {
  const deleteAccountResult = await toggleIsDeletedAccount(true, deleteAccount.account_id);
  if (deleteAccountResult.rows.length === 0) {
    throw new Error("delete account failed, pls contact devs");
  }
  const deletedEntry = deleteAccountResult.rows[0];
  return processAccountData(deletedEntry);
};

const reactivateAccount = async (reactivateAccount: Account.SubmitToggleDeleteObj): Promise<Account.Account> => {
  const reactivateAccountResult = await toggleIsDeletedAccount(false, reactivateAccount.account_id);
  if (reactivateAccountResult.rows.length === 0) {
    throw new Error("reactivate account failed, pls contact devs");
  }
  const reactivatedEntry = reactivateAccountResult.rows[0];
  return processAccountData(reactivatedEntry);
};


// Helper Functions
const toggleIsDeletedAccount = async (isDeleted: boolean, accountId: string) => {
  const toggleIsDeletedResult = await pool.query(Query.getUpdateEntryQuery({
    values: { is_deleted: isDeleted },
    tableName: Account.TABLE_NAME,
    returnValues: Account.accountReturnFields,
    whereCondition: `account_id = '${accountId}'`,
  }));
  return toggleIsDeletedResult;
};


// Utils functions
const processAccountData = (entry: any): Account.Account => {
  return {
    accountId: entry.account_id,
    accountUsername: entry.account_username,
    passwordHash: entry.password_hash,
    email: entry.email,
    createdAt: entry.created_at,
    isAdmin: entry.is_admin,
    isDeleted: entry.is_deleted,
    isBlacklisted: entry.is_blacklisted,
  };
};

const getInactiveCondition = (includeInactive: boolean): string => {
  return includeInactive ? "" : " AND is_deleted IS NOT TRUE AND is_blacklisted IS NOT TRUE";
};

export default {
  createNewAccount,
  deleteAccount,
  editAccountDetails,
  getAccountById,
  getAccountByUsername,
  getAllAccounts,
  reactivateAccount,
};