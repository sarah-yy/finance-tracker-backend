import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import { Account as AccountService } from "@fin-tracker/services";
import { Account } from "@fin-tracker/models";
import { Query, Validate } from "@fin-tracker/util";

export const getAccounts = async (req: Request, res: Response) => {
  try {
    const accounts = await AccountService.getAllAccounts();
    return res.json(accounts);
  } catch (error) {
    return res.status(400).json(Query.getErrorResult("Failed to retrieve accounts"));
  }
};

export const registerAccount = async (req: Request, res: Response): Promise<Response<Account.RegisterAccountOutcome>> => {
  if (!Validate.isObject(req.body)) {
    return res.status(400).json(Query.getErrorResult("Form parameters not an object, pls submit an object."));
  }

  const validateError = Validate.validateBodyObj(req.body, Account.registerValidateArr);
  if (validateError) {
    return res.status(400).json(Query.getErrorResult(validateError));
  }

  const { email, username, password } = req.body;
  const hashedPassword = await bcryptjs.hash(password, 10);
  try {
    const newAccount = await AccountService.createNewAccount({
      account_username: username,
      password_hash: hashedPassword,
      email,
    });
    return res.status(200).json(Query.getSuccessResult<Account.Account>(newAccount));
  } catch (err) {
    const error = err as Error;
    return res.status(400).json(Query.getErrorResult(error.message ?? "Failed to create account"));
  }
};