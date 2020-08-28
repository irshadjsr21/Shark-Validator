import {
  IMatchRegexOptions,
  IRuleValidateOptions,
  IRuleValidateReturn,
} from "../types";
import Rule from "./Rule";

/**
 * @description
 * Checks if the value matches the regular expression.
 */
class MatchRegex extends Rule {
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
   * Checks if the value matches the regular expression.
   *
   * @param options Options for `matchRegex`
   */
  constructor(options: IMatchRegexOptions) {
    super("matchRegex");

    if (options === undefined) {
      throw new TypeError("`options` is required.");
    }

    if (typeof options !== "object") {
      throw new TypeError("`options` should be an object.");
    }

    if (
      typeof options.regex !== "object" ||
      !(options.regex instanceof RegExp)
    ) {
      throw new Error(
        "`regex` key in should be an instance of `RegExp` class.",
      );
    }

    if (options.message !== undefined && typeof options.message !== "string") {
      throw new Error("`message` key in `options` should be a string.");
    }

    this.message = options.message;
    this.regex = options.regex;
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
        regex: this.regex.source,
      };

      if (!this.regex.test(value)) {
        return {
          value,
          error: this.message
            ? this.formatMessage(this.message, data)
            : this.formatMessage(
                "'%name%' should match the regex '%regex%'.",
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
 * Checks if the value matches the regular expression.
 *
 * @param options Options for `matchRegex`
 */
export default function matchRegex(options: IMatchRegexOptions) {
  return new MatchRegex(options);
}
