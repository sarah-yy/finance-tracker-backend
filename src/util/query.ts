import { SimpleMap } from "./types";

type InputValue = string | number;

export interface SelectParams {
  tableName: string;
  selectFields?: string[];
  whereCondition?: string;
}

/**
 * Generate an SELECT SQL statement to select entries from a table
 * @param params parameters to generate SELECT statement
 * @returns SELECT SQL statement (string)
 */
export const getSelectQuery = (params: SelectParams): string => {
  const { selectFields = [], tableName, whereCondition } = params;
  const selectFieldsStr = selectFields.length > 0
    ? selectFields.join(", ")
    : "*";
  const wherePortion = whereCondition ? ` WHERE ${whereCondition}` : "";
  return `SELECT ${selectFieldsStr} FROM ${tableName}${wherePortion}`;
};

export type EntryValuesObj = SimpleMap<InputValue>;

export interface EntryParams {
  tableName: string;
  values: EntryValuesObj;
  returnValues: string[];
}

/**
 * Generate an INSERT SQL statement to add entries to a table
 * @param params parameters to generate INSERT statement
 * @returns INSERT SQL statement (string)
 */
export const getCreateEntryQuery = (params: EntryParams): string => {
  const listOfFields: string[] = [];
  const listOfValues: string[] = [];
  Object.entries(params.values).forEach(([field, value]: [string, InputValue]) => {
    listOfFields.push(field);
    listOfValues.push(typeof value === "string" ? `'${value}'` : `${value}`);
  });
  const fieldsListStr = listOfFields.join(", ");

  return `
    INSERT INTO ${params.tableName} (${fieldsListStr})
    VALUES (${listOfValues.join(", ")})
    ON CONFLICT (${fieldsListStr}) DO NOTHING
    RETURNING ${params.returnValues.join(", ")};
  `;
};

export interface UpdateEntryParams extends EntryParams {
  whereCondition: string;
}

/**
 * Generate an UPDATE SQL statement to update entries to a table
 * @param params parameters to generate UPDATE statement
 * @returns UPDATE SQL statement (string)
 */
export const getUpdateEntryQuery = (params: UpdateEntryParams) => {
  const setValueStr = Object.entries(params.values).reduce((prev: string[], [field, value]: [string, InputValue]) => {
    prev.push(`${field} = ${typeof value === "string" ? `'${value}'` : `${value}`}`);
    return prev;
  }, []);
  return `
    UPDATE ${params.tableName}
    SET ${setValueStr.join(", ")}
    WHERE ${params.whereCondition}
    RETURNING ${params.returnValues.join(", ")};
  `;
};

// Outcome handlers
export enum QueryStatus {
  Success = "success", // eslint-disable-line no-unused-vars
  Error = "error", // eslint-disable-line no-unused-vars
}

export type QueryResult<T = unknown> = {
  status: QueryStatus;
  body: T;
};

/**
 * Helper function returning successful query result
 * @param outcome: payload to return in query response
 * @returns object with query status and payload
 */
export const getSuccessResult = <T = unknown>(body: T): QueryResult<T> => {
  return {
    status: QueryStatus.Success,
    body,
  };
};

/**
 * Helper function returning error query result
 * @param outcome: payload to return in query response
 * @returns object with query status and payload
 */
export const getErrorResult = <T = string>(body: T): QueryResult<T> => {
  return {
    status: QueryStatus.Error,
    body,
  };
};