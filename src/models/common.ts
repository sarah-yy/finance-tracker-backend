export type QueryResult<T = unknown> = {
  rows: T;
  count: number;
};

export type CrudStatus<T = unknown> =  {
  status: "success" | "error";
  output: T;
};

export type AddEditType = "add" | "edit";

export interface ColumnStruct {
  name: string;
  type: string;
  notNull?: boolean;
  primaryKey?: boolean;
  check?: string;
  default?: string | number;
}

export interface ConstraintStruct {
  name: string;
  type: string;
  columns: string[];
}

export const createColumnDef = (struct: ColumnStruct) => {
  return `
    ${struct.name} ${struct.type}
    ${struct.notNull ? " NOT NULL" : ""}
    ${struct.primaryKey ? " PRIMARY KEY" : ""}
    ${struct.check ? ` CHECK(${struct.check})` : ""}
    ${struct.hasOwnProperty("default") ? ` DEFAULT ${struct.default}` : ""}
  `;
};

export const createConstraintDef = (struct: ConstraintStruct) => {
  return `${struct.type} (${struct.columns.join(", ")})`;
};

export const alterConstraintDef = (struct: ConstraintStruct, tableName: string) => {
  return `
    IF NOT EXISTS (
      SELECT True FROM pg_constraint WHERE conname = '${struct.name}'
    ) THEN ALTER TABLE ${tableName} ADD CONSTRAINT ${struct.name} ${struct.type} (${struct.columns.join(", ")});
    END IF;
  `;
};

export const createIncrementSeq = (sequenceName: string) => {
  return `
    CREATE SEQUENCE IF NOT EXISTS ${sequenceName}
    AS INT
    INCREMENT BY 1
    MINVALUE 1
    START WITH 1;
  `;
};
