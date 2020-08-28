import {
  IIsEmailOptions,
  IRuleValidateOptions,
  IRuleValidateReturn,
} from "../types";
import Rule from "./Rule";

/**
 * @description
 * Checks if the value is a valid email address.
 */
class IsEmail extends Rule {
  /**
   * @ignore
   */
  private message: undefined | string;

  /**
   * @ignore
   */
  private regex: RegExp;

  /**
   * @description
   * Checks if the value is a valid email address.
   *
   * @param options Options for `isEmail`
   */
  constructor(options?: IIsEmailOptions) {
    super("isEmail");

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

    this.regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
            : this.formatMessage("'%name%' should be a valid email.", data),
        };
      }
    }
    return { value, error: undefined };
  }
}

/**
 * @description
 * Checks if the value is a valid email address.
 *
 * @param options Options for `isEmail`
 */
export default function isEmail(options: IIsEmailOptions) {
  return new IsEmail(options);
}
