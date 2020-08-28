import {
  IIsIntOptions,
  IRuleValidateOptions,
  IRuleValidateReturn,
} from "../types";
import Rule from "./Rule";

/**
 * @description
 * Checks if the value is an integer
 */
class IsInt extends Rule {
  /**
   * @ignore
   */
  private message: undefined | string;

  /**
   * @ignore
   */
  private min: undefined | number;

  /**
   * @ignore
   */
  private max: undefined | number;

  /**
   * @description
   * Checks if the value is an integer
   *
   * @param options Options for `isInt`
   */
  constructor(options?: IIsIntOptions) {
    super("isInt");

    this.min = undefined;
    this.max = undefined;
    this.message = undefined;

    if (options !== undefined && typeof options !== "object") {
      throw new TypeError("`options` should be an object.");
    }

    if (options !== undefined) {
      if (options.min !== undefined && typeof options.min !== "number") {
        throw new TypeError(`\`min\` key in options should be an integer.`);
      }
      if (options.max !== undefined && typeof options.max !== "number") {
        throw new TypeError(`\`max\` key in options should be an integer.`);
      }

      if (
        options.message !== undefined &&
        typeof options.message !== "string"
      ) {
        throw new Error("`message` key in `options` should be a string.");
      }

      this.min = options.min;
      this.max = options.max;
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

    if (value === undefined || value === null) {
      return { value, error: undefined };
    }

    const data = {
      name: label,
      max: this.max !== undefined ? this.max.toString() : "undefined",
      min: this.min !== undefined ? this.min.toString() : "undefined",
    };

    if (isNaN(value)) {
      return {
        value,
        error: this.message
          ? this.formatMessage(this.message, data)
          : this.formatMessage("'%name%' should be an integer.", data),
      };
    }

    const num = Number.parseFloat(value);

    if (!Number.isInteger(num)) {
      return {
        value,
        error: this.message
          ? this.formatMessage(this.message, data)
          : this.formatMessage("'%name%' should be an integer.", data),
      };
    }

    if (
      this.min !== undefined &&
      this.max !== undefined &&
      (num > this.max || num < this.min)
    ) {
      return {
        value,
        error: this.message
          ? this.formatMessage(this.message, data)
          : this.formatMessage(
              "'%name%' should be a between %min% - %max%.",
              data,
            ),
      };
    }

    if (this.min !== undefined && num < this.min) {
      return {
        value,
        error: this.message
          ? this.formatMessage(this.message, data)
          : this.formatMessage("'%name%' should not be less than %min%.", data),
      };
    }

    if (this.max !== undefined && num > this.max) {
      return {
        value,
        error: this.message
          ? this.formatMessage(this.message, data)
          : this.formatMessage(
              "'%name%' should not be greater than %max%.",
              data,
            ),
      };
    }

    return { value, error: undefined };
  }
}

/**
 * @description
 * Checks if the value is an integer
 *
 * @param options Options for `isInt`
 */
export default function isInt(options: IIsIntOptions) {
  return new IsInt(options);
}
