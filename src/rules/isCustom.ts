import {
  IIsCustomOptions,
  IRuleValidateOptions,
  IRuleValidateReturn,
} from "../types";
import Rule from "./Rule";

/**
 * @description
 * Defines cutom rule
 */
class IsCustom extends Rule {
  /**
   * @ignore
   */
  private message: undefined | string;

  /**
   * @ignore
   */
  private check: IIsCustomOptions["check"];

  /**
   * @description
   * Defines cutom rule
   *
   * @param options Options for `isCustom`
   */
  constructor(options?: IIsCustomOptions) {
    super("isCustom");

    if (typeof options !== "object") {
      throw new TypeError("`options` should be an object.");
    }

    if (options.message !== undefined && typeof options.message !== "string") {
      throw new Error("`message` key in `options` should be a string.");
    }

    if (options.check === undefined || typeof options.check !== "function") {
      throw new Error("`check` key in `options` should be a function.");
    }

    this.message = options.message;
    this.check = options.check;
  }

  /**
   * @description
   * Validate the `value` and return the error `string` if there are any
   * otherwise return `null`.
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

    const checkReturn = this.check(value, options);
    if (checkReturn) {
      const data = {
        name: label,
      };

      return {
        value,
        error: this.message
          ? this.formatMessage(this.message, data)
          : this.formatMessage(checkReturn, data),
      };
    }

    return { value, error: undefined };
  }
}

/**
 * @description
 * Defines cutom rule
 *
 * @param options Options for `isCustom`
 */
export default function isCustom(options: IIsCustomOptions) {
  return new IsCustom(options);
}
