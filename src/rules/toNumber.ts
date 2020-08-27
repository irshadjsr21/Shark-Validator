import {
  IRuleValidateOptions,
  IRuleValidateReturn,
  IToNumberOptions,
} from "../types";
import Rule from "./Rule";

/**
 * @description
 * Converts the value to Number and throws error if it cannot be converted
 */
class ToNumber extends Rule {
  /**
   * @ignore
   */
  private message: undefined | string;

  /**
   * @description
   * Converts the value to Number and throws error if it cannot be converted
   *
   * @param options Options for `toNumber`
   */
  constructor(options?: IToNumberOptions) {
    super("toNumber");

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

    const data = {
      name: label,
    };

    if (isNaN(value)) {
      return {
        value,
        error: this.message
          ? this.formatMessage(this.message, data)
          : this.formatMessage("'%name%' should be a number.", data),
      };
    }

    const num = Number.parseFloat(value);

    return { value: num, error: undefined };
  }
}

/**
 * @description
 * Converts the value to Number and throws error if it cannot be converted
 *
 * @param options Options for `toNumber`
 */
export default function toNumber(options: IToNumberOptions) {
  return new ToNumber(options);
}
