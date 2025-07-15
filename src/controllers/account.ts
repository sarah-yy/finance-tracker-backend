import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as Validate from "validate-ts-obj/lib";
import { Account as AccountService } from "@fin-tracker/services/index";
import { Account } from "@fin-tracker/models/index";
import { Query } from "@fin-tracker/util/index";

export const getAccounts = async (req: Request, res: Response) => {
  try {
    const accounts = await AccountService.getAllAccounts();
    return res.json(accounts);
  } catch (error) {
    return res.status(400).json(Query.getErrorResult("Failed to retrieve accounts"));
  }
};


const getAccountByUsername = async (username: string, includeInactive: boolean = false): Promise<Account.Account | undefined> => {
  try {
    const account = await AccountService.getAccountByUsername(username, includeInactive);
    return account;
  } catch (error) {
    return undefined;
  }
};

const getAccountById = async (id: string, includeInactive: boolean = false): Promise<Account.Account | undefined> => {
  try {
    const account = await AccountService.getAccountById(id, includeInactive);
    return account;
  } catch (err) {
    return undefined;
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

  const { email, username, password } = req.body as Account.RegisterAccountReq;
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

export const logIntoAccount = async (req: Request, res: Response): Promise<Response<string>> => {
  if (!Validate.isObject(req.body)) {
    return res.status(400).json(Query.getErrorResult("Form parameters not an object, pls submit an object."));
  }

  const validateError = Validate.validateBodyObj(req.body, Account.loginValidateArr);
  if (validateError) {
    return res.status(400).json(Query.getErrorResult(validateError));
  }

  const { username, password } = req.body;
  try {
    const user = await getAccountByUsername(username, true);
    if (!user) throw new Error("No account with this username found");
  
    const isPasswordValid = await bcryptjs.compare(password, user.passwordHash);
    if (!isPasswordValid) throw new Error("Invalid password. Pls try again.");
  
    // Include role in the token payload
    const token = jwt.sign({
      id: user.accountId,
    }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
  
    return res.status(200).json(Query.getSuccessResult<string>(token));
  } catch (err) {
    const error = err as Error;
    return res.status(400).json(Query.getErrorResult(error.message ?? "Failed to create account"));
  }
};

export const refreshAccessToken = async (req: any, res: Response): Promise<Response<string>> => {
  if (!req.user) {
    return res.status(400).json(Query.getErrorResult("No user info found."));
  }

  const refreshedToken = jwt.sign({
    id: req.user.id,
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
  return res.status(200).json(Query.getSuccessResult(refreshedToken));
};

export const editAccount = async (req: any, res: Response) => {
  if (!Validate.isObject(req.body)) {
    return res.status(400).json(Query.getErrorResult("Form parameters not an object, pls submit an object."));
  }

  const validateError = Validate.validateBodyObj(req.body, Account.editValidateArr);
  if (validateError) {
    return res.status(400).json(Query.getErrorResult(validateError));
  }

  await verifyActiveAccount(req);

  const { accountId, email, username, password } = req.body as Account.EditAccountReq;
  const hashedPassword = await bcryptjs.hash(password, 10);
  try {
    const newAccount = await AccountService.editAccountDetails({
      account_id: accountId,
      account_username: username,
      password_hash: hashedPassword,
      email,
    });
    return res.status(200).json(Query.getSuccessResult<Account.Account>(newAccount));
  } catch (err) {
    const error = err as Error;
    return res.status(400).json(Query.getErrorResult(error.message ?? "Failed to edit account"));
  }
};

export const deleteAccount = async (req: any, res: Response) => {
  if (!Validate.isObject(req.body)) {
    return res.status(400).json(Query.getErrorResult("Form parameters not an object, pls submit an object."));
  }

  const validateError = Validate.validateBodyObj(req.body, Account.toggleDeleteValidateArr);
  if (validateError) {
    return res.status(400).json(Query.getErrorResult(validateError));
  }

  await verifyActiveAccount(req);

  const { accountId } = req.body as Account.ToggleDeleteReq;
  try {
    const deletedAccount = await AccountService.deleteAccount({
      account_id: accountId,
    });
    return res.status(200).json(Query.getSuccessResult<Account.Account>(deletedAccount));
  } catch (err) {
    const error = err as Error;
    return res.status(400).json(Query.getErrorResult(error.message ?? "Failed to delete account"));
  }
};

export const reactivateAccount = async (req: any, res: Response) => {
  if (!Validate.isObject(req.body)) {
    return res.status(400).json(Query.getErrorResult("Form parameters not an object, pls submit an object."));
  }

  const validateError = Validate.validateBodyObj(req.body, Account.toggleDeleteValidateArr);
  if (validateError) {
    return res.status(400).json(Query.getErrorResult(validateError));
  }

  await verifyActiveAccount(req);

  const { accountId } = req.body as Account.ToggleDeleteReq;
  try {
    const reactivatedAccount = await AccountService.reactivateAccount({
      account_id: accountId,
    });
    return res.status(200).json(Query.getSuccessResult<Account.Account>(reactivatedAccount));
  } catch (err) {
    const error = err as Error;
    return res.status(400).json(Query.getErrorResult(error.message ?? "Failed to reactivate account"));
  }
};


// Util functions

/**
 * Function to check if account is active (i.e. not blacklisted and not deleted)
 * @param req Request obj
 * @returns Promise<void>
 */
export const verifyActiveAccount = async (req: any): Promise<void> => {
  try {
    if (!req.user.id) throw new Error("No account id found");

    const account = await getAccountById(req.user.id);
    if (!account) throw new Error("No account id found");
    if (account.isBlacklisted) throw new Error("Account is blacklisted");
    if (account.isDeleted) throw new Error("Account is deleted");
  } catch (err) {
    const errorTyped = err as Error;
    throw new Error(`Failed to verify account: ${errorTyped.message}`);
  }
};