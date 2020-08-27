import {
  IIsObjectOptions,
  IRuleValidateOptions,
  IRuleValidateReturn,
} from "../types";
import Validator from "../Validator";
import Rule from "./Rule";

/**
 * @description
 * Checks if the value is an object and satisfies the given schema
 */
class IsObject extends Rule {
  /**
   * @ignore
   */
  private message: undefined | string;

  /**
   * @ignore
   */
  private schema: Validator;

  /**
   * @description
   * Checks if the value is an object and satisfies the given schema
   *
   * @param options Options for `isObject`
   */
  constructor(options: IIsObjectOptions) {
    super("isObject");

    if (options === undefined) {
      throw new TypeError("`options` is required.");
    }

    if (typeof options !== "object") {
      throw new TypeError("`options` should be an object.");
    }

    if (options.message !== undefined && typeof options.message !== "string") {
      throw new Error("`message` key in `options` should be a string.");
    }

    this.message = options.message;

    if (!(options.schema instanceof Validator)) {
      throw new Error(
        "`schema` key in `options` should be an instance of class `Validator`.",
      );
    }

    this.schema = options.schema;
  }

  /**
   * @description
   * Validate the `value` and return the error `string` if there are any
   * otherwise return `undefined`.
   *
   * @param value The value to be checked.
   * @param options Options for validate.
   */
  public validate(
    value: any,
    options: IRuleValidateOptions,
  ): IRuleValidateReturn {
    let showNestedError: boolean = false;
    if (typeof options !== "object") {
      throw new TypeError("`options` should be an object.");
    }

    if (typeof options.label !== "string") {
      throw new TypeError("`options.label` should be a string.");
    }

    const { label } = options;

    if (!Array.isArray(options.path)) {
      throw new TypeError("`options.path` should be an array.");
    }

    if (options.showNestedError !== undefined) {
      if (typeof options.showNestedError !== "boolean") {
        throw new TypeError("`options.showNestedError` should be a boolean.");
      }

      showNestedError = options.showNestedError;
    }

    const data = {
      name: label,
    };

    if (typeof value !== "object") {
      return {
        value,
        error: this.message
          ? this.formatMessage(this.message, data)
          : this.formatMessage("'%name%' should be an object.", data),
      };
    }

    let currentPath: any[] = [];
    if (options.path !== undefined && (options.path as any[]).length > 0) {
      currentPath = options.path;
    }

    const { errors, values } = this.schema.validate(value, {
      path: currentPath,
      showNestedError,
      returnRuleSetEarly: options.returnEarly,
    });

    if (errors && Object.keys(errors).length > 0) {
      return {
        value: values,
        error: errors,
      };
    }
    return { value: values, error: undefined };
  }
}

/**
 * @description
 * Checks if the value is an object and satisfies the given schema
 *
 * @param options Options for `isObject`
 */

export default function isObject(options: IIsObjectOptions) {
  return new IsObject(options);
}
