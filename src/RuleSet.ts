import { Rule } from "./rules";
import {
  IRuleSetOptions,
  IRuleSetValidateOptions,
  IRuleSetValidateReturn,
} from "./types";

/**
 * Creates a set of rules for a single key.
 */
class RuleSet {
  /**
   * @ignore
   * @private
   */
  private rules: Rule[];

  /**
   * @ignore
   * @private
   */
  private label: undefined | string;

  /**
   * @description
   * Create a ruleset for a particular `key` or `value`.
   *
   * @param options Options for `RuleSet`.
   */
  constructor(options: IRuleSetOptions) {
    if (Array.isArray(options.rules)) {
      if (options.rules.length <= 0) {
        throw new TypeError("`options.rules` should not be empty.");
      }
      this.rules = [...options.rules];
    } else {
      this.rules = [options.rules];
    }
    this.label = options.label;
  }

  /**
   * @description
   * Validates the `value` and returns an array of errors if any,
   * othewise returns `undefined`.
   *
   * @param valueToCheck Value to be validated
   * @param key Key of the value being checked
   * @param options Options for validate
   * @returns An object containing `value` and `errors` if any
   */
  public validate(
    valueToCheck: any,
    key: string,
    options: IRuleSetValidateOptions,
  ): IRuleSetValidateReturn {
    let errors: any[] = [];
    let modifiedValue = valueToCheck;
    let returnEarly = false;
    let path: any[] = [];
    let showNestedError = false;

    if (options !== undefined) {
      if (typeof options !== "object") {
        throw new TypeError("`options` should be an object.");
      }

      if (options.returnEarly !== undefined) {
        if (typeof options.returnEarly !== "boolean") {
          throw new TypeError("`options.returnEarly` should be a boolean.");
        }

        returnEarly = options.returnEarly;
      }

      if (options.path !== undefined) {
        if (!Array.isArray(options.path)) {
          throw new TypeError("`options.path` should be an array.");
        }

        path = options.path;
      }

      if (options.showNestedError !== undefined) {
        if (typeof options.showNestedError !== "boolean") {
          throw new TypeError("`options.showNestedError` should be a boolean.");
        }

        showNestedError = options.showNestedError;
      }
    }

    for (const rule of this.rules) {
      if (!(rule instanceof Rule)) {
        throw new TypeError("Rule should be an instance of `Rule` class.");
      }

      let currentPath: any[] = [key];
      if (options.isArrayElem) {
        currentPath = path;
      } else if (path) {
        currentPath = path.concat(key);
      }

      const { value, error } = rule.validate(modifiedValue, {
        label: this.label || key,
        key,
        path: currentPath,
        showNestedError,
        returnEarly,
      });

      modifiedValue = value;

      if (error) {
        if (!showNestedError && typeof error === "object") {
          for (const innerKey in error) {
            if (error[innerKey]) {
              errors = errors.concat(error[innerKey]);
            }
          }
        } else {
          errors.push({
            error,
            validator: rule.name,
            value,
            path: currentPath,
          });
        }
        if (returnEarly) {
          break;
        }
      }
    }

    if (errors.length > 0) {
      return { value: modifiedValue, errors };
    }

    return { value: modifiedValue, errors: undefined };
  }
}

export default RuleSet;
