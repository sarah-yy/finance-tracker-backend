import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
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

export const logIntoAccount = async (req: Request, res: Response) => {
  return res.status(200).json({ status: "This is happening" });
  // const { username, password } = req.body;
  // const user = users.find(u => u.username === username);

  // if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  // const isPasswordValid = await bcrypt.compare(password, user.password);
  // if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

  // // Include role in the token payload
  // const token = jwt.sign({ id: user.username, role: user.role }, process.env.JWT_SECRET, {
  //     expiresIn: process.env.JWT_EXPIRATION,
  // });

  // res.json({ token });
};