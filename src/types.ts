/* tslint:disable:no-empty-interface */
import Rule from "./rules/Rule";
import Validator from "./Validator";

export interface ISchemaError {
  /** Error message or nested error object. */
  error: string | ISchemaErrors;
  /** Name of the `Rule` where the error occured.. */
  validator: string;
  /** The value on which the rule failed. */
  value: any;
  /** Path to the value. */
  path: any[];
}

export interface ISchemaErrors {
  [key: string]: ISchemaError[];
}

/** Values to be checked */
export interface IValidatorValidateValues {
  [key: string]: any;
}

export interface IValidatorValidateOptions {
  /** Specifies the current validation path. */
  path?: any[];
  /** If `true` returns whenever first `key` in `values` fails the test. */
  returnEarly?: boolean;
  /** If `true` returns the after getting the first error on all `keys`. */
  returnRuleSetEarly?: boolean;
  /** If `true` shows nested errors. */
  showNestedError?: boolean;
}

/** Return type for validators */
export interface IValidatorValidateReturn {
  /** Values that where tested (or modified) */
  values: any;
  /** Errors */
  errors?: ISchemaErrors;
}

export interface IValidatorRuleSetExpanded {
  /** Set of rules to be checked */
  rules: Rule | Rule[];
  /** The name or label of the value being checked. */
  label?: string;
}

export interface IValidatorRuleSet {
  /** Set of `Rule`(s), `key` should match with the `key` of object being validated. */
  [key: string]: Rule | Rule[] | IValidatorRuleSetExpanded;
}

export interface IValidatorOptions {
  /** If `true` returns whenever first `key` in `values` fails the test. */
  returnEarly?: boolean;
  /** If `true` returns the after getting the first error on all `keys`. */
  returnRuleSetEarly?: boolean;
  /** If `true` shows nested errors. */
  showNestedError?: boolean;
}

export interface IRuleSetOptions {
  /** Set of rules to be checked */
  rules: Rule | Rule[];
  /** The name or label of the value being checked. */
  label?: string;
}

export interface IRuleSetValidateOptions {
  /** If `true` returns the after getting the first error. */
  returnEarly?: boolean;
  /** If `true` shows nested errors. */
  showNestedError?: boolean;
  /** Specifies the current validation path. */
  path?: any[];
  /** If the field being checked is an array element. */
  isArrayElem?: boolean;
  /** All the values that are under test. */
  allValues?: any;
}

export interface IRuleSetValidateReturn {
  /** Value that was tested (or modified) */
  value: any;
  /** Errors */
  errors?: ISchemaError[];
}

export interface IRuleValidateOptions {
  /** The key for the value to be checked */
  key: string;
  /** The name or label of the value being checked. */
  label: string;
  /** Specifies the current validation path. */
  path: any[];
  /** If `true` shows nested errors. */
  showNestedError?: boolean;
  /** If `true` returns the after getting the first error. */
  returnEarly?: boolean;
  /** All the values that are under test. */
  allValues?: any;
}

export interface IRuleValidateError {
  [key: string]: string | ISchemaError[];
}

export interface IRuleValidateReturn {
  /** Values that where tested (or modified) */
  value: any;
  /** Error */
  error?: string | IRuleValidateError;
}

export interface IRuleFormatterValues {
  [key: string]: string;
}

export interface IRuleOptions {
  /** Custom error message if test fails. (check {@link Rule.formatMessage} for more customization details) */
  message?: string;
}

export interface IIsAlphaOptions extends IRuleOptions {
  /** If `true`, it allows spaces. */
  allowSpaces?: boolean;
}

export interface IIsAlphaNumOptions extends IRuleOptions {
  /** If `true`, it allows spaces. */
  allowSpaces?: boolean;
}

export interface IIsArrayOptions extends IRuleOptions {
  /** Set of rules to be checked */
  rules: Rule | Rule[];
  /** Length should be min `min` */
  min?: number;
  /** Length should be max to `max` */
  max?: number;
  /** Length should be equal to `eq` */
  eq?: number;
}

export interface IIsObjectOptions extends IRuleOptions {
  /** A `Validator` object to be checked against the object. */
  schema: Validator;
}

export interface IIsArrayOfObjectOptions extends IRuleOptions {
  /** A `Validator` object to be checked against the object. */
  schema: Validator;
  /** Length should be min `min` */
  min?: number;
  /** Length should be max to `max` */
  max?: number;
  /** Length should be equal to `eq` */
  eq?: number;
}

export interface IIsEmailOptions extends IRuleOptions {}

export interface IIsInOptions extends IRuleOptions {
  /** Array containing possible values. */
  in: string[] | number[];
}

export interface IIsIntOptions extends IRuleOptions {
  /** Number should be min to `min`. */
  min?: number;
  /** Number should be max to `max`. */
  max?: number;
}

export interface IIsLenOptions extends IRuleOptions {
  /** Length should be min `min` */
  min?: number;
  /** Length should be max to `max` */
  max?: number;
  /** Length should be equal to `eq` */
  eq?: number;
}

export interface IIsNumberOptions extends IRuleOptions {
  /** Number should be min to `min`. */
  min?: number;
  /** Number should be max to `max`. */
  max?: number;
}

export interface IIsRequiredOptions extends IRuleOptions {}

export interface IIsStringOptions extends IRuleOptions {}

export interface IMatchRegexOptions extends IRuleOptions {
  /** Regex expression to be tested. */
  regex: RegExp;
}

export interface IToIntOptions extends IRuleOptions {}

export interface IToNumberOptions extends IRuleOptions {}

export interface IIsCustomOptions extends IRuleOptions {
  /* tslint:disable:max-line-length */
  /** Function to check if the value should be allowed. Returns the `string` error if any, otherwise returns `false` or `undefined`. */
  check(value: any, options?: IRuleValidateOptions): undefined | false | string;
}
