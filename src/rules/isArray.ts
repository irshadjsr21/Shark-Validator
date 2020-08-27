import RuleSet from "../RuleSet";
import {
  IIsArrayOptions,
  IRuleValidateError,
  IRuleValidateOptions,
  IRuleValidateReturn,
} from "../types";
import Rule from "./Rule";

/**
 * @description
 * Checks if value is an array and each value satisfies the given rules
 */
export class IsArray extends Rule {
  /**
   * @ignore
   */
  private message: undefined | string;

  /**
   * @ignore
   */
  private rules: RuleSet;

  /**
   * @ignore
   */
  private max: undefined | number;

  /**
   * @ignore
   */
  private min: undefined | number;

  /**
   * @ignore
   */
  private eq: undefined | number;

  /**
   * @description
   * Checks if value is an array and each value satisfies the given rules
   *
   * @param options Options for `isArray`
   */
  constructor(options: IIsArrayOptions) {
    super("isArray");

    if (typeof options !== "object") {
      throw new TypeError("`options` should be an object.");
    }

    if (options.message !== undefined && typeof options.message !== "string") {
      throw new Error("`options.message` key in `options` should be a string.");
    }

    this.message = options.message;

    if (options.rules === undefined) {
      throw new Error("`options.rules` key in `options` is required.");
    }

    if (
      !(options.rules instanceof Rule) &&
      !(
        Array.isArray(options.rules) &&
        options.rules.length > 0 &&
        options.rules[0] instanceof Rule
      )
    ) {
      throw new Error("`options.rules` should be a Rule or array of Rule(s).");
    }

    this.rules = new RuleSet({ rules: options.rules });

    if (options.min !== undefined && typeof options.min !== "number") {
      throw new TypeError(`\`min\` key in options should be an integer.`);
    }
    if (options.max !== undefined && typeof options.max !== "number") {
      throw new TypeError(`\`max\` key in options should be an integer.`);
    }
    if (options.eq !== undefined && typeof options.eq !== "number") {
      throw new TypeError(`\`eq\` key in options should be an integer.`);
    }

    this.min = options.min;
    this.max = options.max;
    this.eq = options.eq;
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
      max: this.max !== undefined ? this.max.toString() : "undefined",
      min: this.min !== undefined ? this.min.toString() : "undefined",
      eq: this.eq !== undefined ? this.eq.toString() : "undefined",
    };

    if (!Array.isArray(value)) {
      return {
        value,
        error: this.message
          ? this.formatMessage(this.message, data)
          : this.formatMessage("'%name%' should be an array.", data),
      };
    }

    const len = value.length;

    if (this.eq !== undefined && len !== this.eq) {
      return {
        value,
        error: this.message
          ? this.formatMessage(this.message, data)
          : this.formatMessage("'%name%' should contain %eq% elements.", data),
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
              "'%name%' should have %min% - %max% elements.",
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
              "'%name%' should have greater than %min% elements.",
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
              "'%name%' should have less than %max% elements.",
              data,
            ),
      };
    }

    const allErrors: IRuleValidateError = {};
    const allValues = [];
    let currentPath: any[] = [];
    if (options.path !== undefined && (options.path as any[]).length > 0) {
      currentPath = options.path;
    }

    for (let i = 0; i < len; i += 1) {
      const { errors, value: localValue } = this.rules.validate(
        value[i],
        options.key,
        {
          path: currentPath.concat(i),
          showNestedError,
          isArrayElem: true,
          returnEarly: options.returnEarly,
        },
      );
      if (errors && Object.keys(errors).length > 0) {
        allErrors[`${i}`] = errors;
        if (options.returnEarly) {
          return {
            value: allValues.concat(value.slice(i + 1)),
            error: allErrors,
          };
        }
      }
      allValues.push(localValue);
    }

    if (allErrors && Object.keys(allErrors).length > 0) {
      return {
        value: allValues,
        error: allErrors,
      };
    }

    return { value: allValues, error: undefined };
  }
}

/**
 * @description
 * Checks if value is an array and each value satisfies the given rules
 *
 * @param options Options for isArray Rule
 */

export default function isArray(options: IIsArrayOptions) {
  return new IsArray(options);
}
