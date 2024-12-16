type CreateEntryValue = string | number;

export interface CreateEntryValuesObj {
  [field: string]: CreateEntryValue;
};

export interface CreateEntryParams {
  tableName: string;
  values: CreateEntryValuesObj;
  returnValues: string[];
}

export const getCreateEntryQuery = (params: CreateEntryParams): string => {
  const listOfFields: string[] = [];
  const listOfValues: string[] = [];
  Object.entries(params.values).forEach(([field, value]: [string, CreateEntryValue]) => {
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