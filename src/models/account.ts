import { ColumnStruct, ConstraintStruct } from "./common";

export interface Account {
  accountId: string;
  accountUsername: string;
  passwordHash: string;
  email: string;
  createdAt: string;
}

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
