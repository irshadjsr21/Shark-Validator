import {
  IIsLenOptions,
  IRuleValidateOptions,
  IRuleValidateReturn,
} from "../types";
import Rule from "./Rule";

/**
 * @description
 * Checks length of string value
 */
class IsLen extends Rule {
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
   * @ignore
   */
  private eq: undefined | number;

  /**
   * @description
   * Checks length of string value
   *
   * @param options Options for `isLen`
   */
  constructor(options: IIsLenOptions) {
    super("isLen");
    if (!options || typeof options !== "object") {
      throw new TypeError("`options` should be an object.");
    }

    if (Object.keys(options).length <= 0) {
      throw new Error(
        "`options` should have atleast one of `min`, `max` or `eq` key.",
      );
    }

    if (options.min !== undefined && typeof options.min !== "number") {
      throw new TypeError(`\`min\` key in options should be an integer.`);
    }
    if (options.max !== undefined && typeof options.max !== "number") {
      throw new TypeError(`\`max\` key in options should be an integer.`);
    }
    if (options.eq !== undefined && typeof options.eq !== "number") {
      throw new TypeError(`\`eq\` key in options should be an integer.`);
    }

    if (options.message !== undefined && typeof options.message !== "string") {
      throw new Error("`message` key in `options` should be a string.");
    }

    this.min = options.min;
    this.max = options.max;
    this.eq = options.eq;
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

    if (typeof value === "string") {
      const len = value.length;
      const data = {
        name: label,
        max: this.max !== undefined ? this.max.toString() : "undefined",
        min: this.min !== undefined ? this.min.toString() : "undefined",
        eq: this.eq !== undefined ? this.eq.toString() : "undefined",
      };

      if (this.eq !== undefined && len !== this.eq) {
        return {
          value,
          error: this.message
            ? this.formatMessage(this.message, data)
            : this.formatMessage(
                "'%name%' should be %eq% characters long.",
                data,
              ),
        };
      }

      if (
        this.min !== undefined &&
        this.max !== undefined &&
        (len > this.max || len < this.min)
      ) {
        return {
          value,
          error: this.message
            ? this.formatMessage(this.message, data)
            : this.formatMessage(
                "'%name%' should be a between %min% - %max% characters.",
                data,
              ),
        };
      }

      if (this.min !== undefined && len < this.min) {
        return {
          value,
          error: this.message
            ? this.formatMessage(this.message, data)
            : this.formatMessage(
                "'%name%' should not be less than %min% characters.",
                data,
              ),
        };
      }

      if (this.max !== undefined && len > this.max) {
        return {
          value,
          error: this.message
            ? this.formatMessage(this.message, data)
            : this.formatMessage(
                "'%name%' should not be greater than %max% characters.",
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
 * Checks length of string value
 *
 * @param options Options for `isLen`
 */
export default function isLen(options: IIsLenOptions) {
  return new IsLen(options);
}
