import {
  IIsInOptions,
  IRuleValidateOptions,
  IRuleValidateReturn,
} from "../types";
import Rule from "./Rule";

/**
 * @description
 * Checks if the value is in the given array (works for number and strings) (is type sensitive)
 */
class IsIn extends Rule {
  /**
   * @ignore
   */
  private message: undefined | string;

  /**
   * @ignore
   */
  private in: IIsInOptions["in"];

  /**
   * @description
   * Checks if the value is in the given array (works for number and strings) (is type sensitive)
   *
   * @param {Object} options Options for `isIn`
   */
  constructor(options: IIsInOptions) {
    super("isIn");

    if (!options || typeof options !== "object") {
      throw new TypeError("`options` should be an object.");
    }

    if (Object.keys(options).length <= 0) {
      throw new Error("`options` should have `in` key.");
    }

    if (!options.in || !Array.isArray(options.in)) {
      throw new Error("`in` key in `options` should be an array.");
    }

    if (options.in.length <= 0) {
      throw new Error("`in` key in `options` should not be empty.");
    }

    if (options.message !== undefined && typeof options.message !== "string") {
      throw new Error("`message` key in `options` should be a string.");
    }

    this.in = options.in;
    this.message = options.message;
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
    if (typeof options !== "object") {
      throw new TypeError("`options` should be an object.");
    }

    if (typeof options.label !== "string") {
      throw new TypeError("`options.label` should be a string.");
    }

    const { label } = options;

    if (value === undefined || value === null) {
      return { value, error: undefined };
    }

    const data = {
      name: label,
      in: this.in.join(", "),
    };
    const errorMsg = this.message
      ? this.formatMessage(this.message, data)
      : this.formatMessage("'%name%' should be one of '%in%'.", data);

    if (typeof value !== "string" && typeof value !== "number") {
      return { value, error: errorMsg };
    }

    if (
      typeof this.in[0] === "string" &&
      typeof value === "string" &&
      (this.in as string[]).includes(value)
    ) {
      return { value, error: undefined };
    }

    if (
      typeof this.in[0] === "number" &&
      typeof value === "number" &&
      (this.in as number[]).includes(value)
    ) {
      return { value, error: undefined };
    }

    return { value, error: errorMsg };
  }
}

/**
 * @description
 * Checks if the value is in the given array (works for number and strings) (is type sensitive)
 *
 * @param options Options for `isIn`
 */
export default function isIn(options: IIsInOptions) {
  return new IsIn(options);
}
