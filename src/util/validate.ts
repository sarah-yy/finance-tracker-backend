const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i;

export enum ValueType {
  String = "string", // eslint-disable-line no-unused-vars
  Email = "email", // eslint-disable-line no-unused-vars
  Number = "number", // eslint-disable-line no-unused-vars
}

export interface ValidateObjStruct {
  name: string;
  type: ValueType;
  required?: boolean;
  // For strings only
  minLength?: number;
  maxLength?: number;
  // For numbers only
  minNum?: number;
  maxNum?: number;
}

export type ValidateFieldArr = ValidateObjStruct[];

export const isObject = (obj: any): boolean => {
  if (typeof obj !== "object") return false;
  if (!!Array.isArray) return !Array.isArray(obj);
  return Object.prototype.toString.call(obj) === "[object Array]";
};

export const hasObjItem = (obj: {
  [key: string]: any
}, key: string) => {
  return obj.hasOwnProperty(key);
};

export const validateBodyObj = (body: {
  [key: string]: any;
}, validateObj: ValidateFieldArr): string | undefined => {
  const requiredFieldsStr = validateObj.reduce((prev: string[], validateItem: ValidateObjStruct) => {
    if (!validateItem.required) return prev;
    prev.push(validateItem.name);
    return prev;
  }, []);

  for (let ii = 0; ii < validateObj.length; ii++) {
    const validateItem = validateObj[ii];

    // Missing field check
    if (validateItem.required && !hasObjItem(body, validateItem.name)) {
      return `Missing ${validateItem.name} field. Please make sure to submit all required fields: ${requiredFieldsStr.join(", ")}`;
    }

    // Number checks
    if (validateItem.type === ValueType.Number && body[validateItem.name]) {
      const strToNum = parseInt(body[validateItem.name]);

      // Check if value is valid number
      // Throw error if this is not a valid number
      if (!isFinite(strToNum)) {
        return `Invalid ${validateItem.name} value, please enter a number`;
      }

      // Check if a value is more than or equal the minimum value
      // Throw error if value < minimum value
      if (validateItem.minNum && strToNum < validateItem.minNum) {
        return `${validateItem.name} value too small, please enter a number >= ${validateItem.minNum}`;
      }

      // Check if a value is less than or equal the maximum value
      // Throw error if value > maximum value
      if (validateItem.maxNum && strToNum > validateItem.maxNum) {
        return `${validateItem.name} value too big, please enter a number <= ${validateItem.maxNum}`;
      }
    }

    // Check if value is a valid email
    // Throw error if this is not a valid email address
    if (
      validateItem.type === ValueType.Email
      && body[validateItem.name]
      && !emailRegex.test(body[validateItem.name])
    ) {
      return `Invalid ${validateItem.name} value, please enter a valid email`;
    }

    // Check if this string has the correct min length
    // Throw error if this value's length < min length
    if (
      validateItem.minLength
      && body[validateItem.name]
      && body[validateItem.name].length < validateItem.minLength
    ) {
      return `Invalid string length for ${validateItem.name} field. Please input a string with ${validateItem.minLength} or more characters`;
    }

    // Check if this string has the correct max length
    // Throw error if this value's length > max length
    if (
      validateItem.maxLength
      && body[validateItem.name]
      && body[validateItem.name].length > validateItem.maxLength
    ) {
      return `Invalid string length for ${validateItem.name} field. Please input a string with ${validateItem.maxLength} or fewer characters`;
    }
  }
  return undefined;
};