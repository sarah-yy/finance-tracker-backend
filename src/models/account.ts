import { Query, Validate } from "@fin-tracker/util/index";
import { ColumnStruct, ConstraintStruct } from "./common";

export interface Account {
  accountId: string;
  accountUsername: string;
  passwordHash: string;
  email: string;
  createdAt: string;
  isAdmin: boolean;
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
  name: "is_admin",
  type: "BOOLEAN",
  notNull: true,
  default: "FALSE",
}];

export const CONSTRAINT_DEFS: ConstraintStruct[] = [];


// API REQUEST STRUCTS

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

export type RegisterAccountOutcome = Query.QueryResult<Account> | Query.QueryResult<string>;


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
export interface EditAccountReq extends RegisterAccountReq {
  accountId: string;
}

export interface SubmitEditObj extends SubmitRegisterObj {
  account_id: string;
}

export const editValidateArr = [
  ...registerValidateArr,
  {
    name: "account_id",
    type: Validate.ValueType.String,
    required: true,
  },
];

export type EditAccountOutcome = Query.QueryResult<Account> | Query.QueryResult<string>;


export const accountReturnFields: string[] = TABLE_COLUMNS.map((value: ColumnStruct) => value.name);