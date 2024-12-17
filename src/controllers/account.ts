import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Account as AccountService } from "@fin-tracker/services/index";
import { Account } from "@fin-tracker/models/index";
import { Query, Validate } from "@fin-tracker/util/index";

export const getAccounts = async (req: Request, res: Response) => {
  try {
    const accounts = await AccountService.getAllAccounts();
    return res.json(accounts);
  } catch (error) {
    return res.status(400).json(Query.getErrorResult("Failed to retrieve accounts"));
  }
};


const getAccountByUsername = async (username: string): Promise<Account.Account | undefined> => {
  try {
    const account = await AccountService.getAccountByUsername(username);
    return account;
  } catch (error) {
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
    const user = await getAccountByUsername(username);
    if (!user) throw new Error("No account with this username found");
  
    const isPasswordValid = await bcryptjs.compare(password, user.passwordHash);
    if (!isPasswordValid) throw new Error("Invalid password. Pls try again.");
  
    // Include role in the token payload
    const token = jwt.sign({ id: user.accountUsername, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
  
    return res.status(200).json(Query.getSuccessResult<string>(token));
  } catch (err) {
    const error = err as Error;
    return res.status(400).json(Query.getErrorResult(error.message ?? "Failed to create account"));
  }
};