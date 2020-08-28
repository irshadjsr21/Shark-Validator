import {
  IIsAlphaNumOptions,
  IRuleValidateOptions,
  IRuleValidateReturn,
} from "../types";
import Rule from "./Rule";

/**
 * @description
 * Checks if the value contains only Alphabets and numbers.
 */
class IsAlphaNum extends Rule {
  /**
   * @ignore
   */
  private message: undefined | string;

  /**
   * @ignore
   */
  private allowSpaces: boolean;

  /**
   * @ignore
   */
  private regex: RegExp;

  /**
   * @description
   * Checks if the value contains only Alphabets and numbers.
   *
   * @param options Options for `isAlphaNum`
   */
  constructor(options?: IIsAlphaNumOptions) {
    super("isAlphaNum");
    let allowedString = "a-z0-9";
    this.message = undefined;
    this.allowSpaces = false;
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

      if (
        options.allowSpaces !== undefined &&
        typeof options.allowSpaces !== "boolean"
      ) {
        throw new Error("`allowSpaces` key in `options` should be a boolean.");
      }

      this.message = options.message;

      if (typeof options.allowSpaces !== "undefined") {
        this.allowSpaces = options.allowSpaces;
      }

      if (this.allowSpaces) {
        allowedString += "\\s";
      }
    }

    this.regex = new RegExp(`^[${allowedString}]*$`, "i");
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

    if (typeof value === "string") {
      const data = {
        name: label,
      };

      if (!this.regex.test(value)) {
        return {
          value,
          error: this.message
            ? this.formatMessage(this.message, data)
            : this.formatMessage(
                "'%name%' should contain only alphabets and numbers.",
                data,
              ),
        };
      }
    }
    return { value, error: undefined };
  }
}

/**
 * @description
 * Checks if the value contains only Alphabets and numbers.
 *
 * @param {Object} options Options for `isAlphaNum`
 */
export default function isAlphaNum(options: IIsAlphaNumOptions) {
  return new IsAlphaNum(options);
}
