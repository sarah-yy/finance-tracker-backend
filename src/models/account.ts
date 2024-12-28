import { Query, Validate } from "@fin-tracker/util/index";
import { ColumnStruct, ConstraintStruct } from "./common";

export interface Account {
  accountId: string;
  accountUsername: string;
  passwordHash: string;
  email: string;
  createdAt: string;
  isDeleted: boolean;
  isBlacklisted: boolean;
}

// PSQL Table Values
export const SEQUENCE_NAME = "account_id";

export const TABLE_NAME = "accounts";

export const TABLE_COLUMNS: ColumnStruct[] = [{
  name: "account_id",
  type: "UUID",
  notNull: true,
  primaryKey: true,
  default: "uuid_generate_v1()",
}, {
  name: "account_username",
  type: "VARCHAR(255)",
  notNull: true,
}, {
  name: "password_hash",
  type: "VARCHAR(500)",
  notNull: true,
}, {
  name: "email",
  type: "VARCHAR(255)",
  notNull: true,
}, {
  name: "created_at",
  type: "TIMESTAMP",
  notNull: true,
  default: "NOW()",
}, {
  name: "is_blacklisted",
  type: "BOOLEAN",
  notNull: true,
  default: "FALSE",
}, {
  name: "is_deleted",
  type: "BOOLEAN",
  notNull: true,
  default: "FALSE",
}];

export const CONSTRAINT_DEFS: ConstraintStruct[] = [];


// API REQUEST STRUCTS

// Account Id Structs
interface AccountIdBase {
  accountId: string;
}

interface SubmitAccountIdBaseObj {
  account_id: string;
}

const accountIdBaseValidateArr: Validate.ValidateFieldArr = [{
  name: "account_id",
  type: Validate.ValueType.String,
  required: true,
}];

export type BaseAccountOutcome = Query.QueryResult<Account> | Query.QueryResult<string>;


// Register Account Structs
export interface RegisterAccountReq {
  username: string;
  password: string;
  email: string;
}

export interface SubmitRegisterObj {
  account_username: string;
  password_hash: string;
  email: string;
}

export const registerValidateArr: Validate.ValidateFieldArr = [{
  name: "username",
  type: Validate.ValueType.String,
  required: true,
  minLength: 3,
  maxLength: 50,
}, {
  name: "password",
  type: Validate.ValueType.String,
  required: true,
  minLength: 3,
  maxLength: 50,
}, {
  name: "email",
  type: Validate.ValueType.Email,
  required: true,
}];

export type RegisterAccountOutcome = BaseAccountOutcome;


// Login Account Structs
export interface LoginAccountReq {
  username: string;
  password: string;
}

export const loginValidateArr: Validate.ValidateFieldArr = [{
  name: "username",
  type: Validate.ValueType.String,
  required: true,
  minLength: 3,
  maxLength: 50,
}, {
  name: "password",
  type: Validate.ValueType.String,
  required: true,
  minLength: 3,
  maxLength: 50,
}];


// Edit Account Structs
export interface EditAccountReq extends RegisterAccountReq, AccountIdBase {
  accountId: string;
}

export interface SubmitEditObj extends SubmitRegisterObj {
  account_id: string;
}

export const editValidateArr = [
  ...registerValidateArr,
  ...accountIdBaseValidateArr,
];

export type EditAccountOutcome = BaseAccountOutcome;


// Delete Account
export type ToggleDeleteReq = AccountIdBase;

export type SubmitToggleDeleteObj = SubmitAccountIdBaseObj;

export const toggleDeleteValidateArr: Validate.ValidateFieldArr = [
  ...accountIdBaseValidateArr,
];

export type ToggleDeleteAccountOutcome = BaseAccountOutcome;


// Return constants
export const accountReturnFields: string[] = TABLE_COLUMNS.map((value: ColumnStruct) => value.name);