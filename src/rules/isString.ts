import {
  IIsStringOptions,
  IRuleValidateOptions,
  IRuleValidateReturn,
} from "../types";
import Rule from "./Rule";

/**
 * @description
 * Requires the field to be a `string`
 */
class IsString extends Rule {
  /**
   * @ignore
   */
  private message: undefined | string;

  /**
   * @description
   * Requires the field to be a `string`
   *
   * @param options Options for `isString`
   */
  constructor(options?: IIsStringOptions) {
    super("isString");

    if (options !== undefined && typeof options !== "object") {
      throw new TypeError("`options` should be an object.");
    }

    if (options !== undefined) {
      if (
        options.message !== undefined &&
        typeof options.message !== "string"
      ) {
        throw new Error("`message` key in `options` should be a string.");
      }

      this.message = options.message;
    }
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

    if (typeof value !== "string") {
      const data = {
        name: label,
      };

      return {
        value,
        error: this.message
          ? this.formatMessage(this.message, data)
          : this.formatMessage("'%name%' should be a string.", data),
      };
    }
    return { value, error: undefined };
  }
}

/**
 * @description
 * Requires the field to be a `string`
 *
 * @param options Options for `isString`
 */
export default function isString(options: IIsStringOptions) {
  return new IsString(options);
}
