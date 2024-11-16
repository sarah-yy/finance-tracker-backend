import pool from "../config/database";
import { Account } from "../models/account";

const getAllAccounts = async (): Promise<Account[]> => {
  const { rows } = await pool.query("SELECT * FROM accounts");
  return rows;
};

export default { getAllAccounts };