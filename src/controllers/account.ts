import { Request, Response } from "express";
import accountService from "../services/account";

export const getAccounts = async (req: Request, res: Response) => {
  try {
    const accounts = await accountService.getAllAccounts();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve accounts" });
  }
};