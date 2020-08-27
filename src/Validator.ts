import Rule from "./rules/Rule";
import RuleSet from "./RuleSet";
import {
  IValidatorOptions,
  IValidatorRuleSet,
  IValidatorRuleSetExpanded,
  IValidatorValidateOptions,
  IValidatorValidateReturn,
  IValidatorValidateValues,
} from "./types";

/**
 * @description
 * Creates a Validator.
 */
export default class Validator {
  /**
   * @ignore
   * @private
   */
  private ruleSets: IValidatorRuleSet;

  /**
   * @ignore
   * @private
   */
  private returnEarly: undefined | boolean;

  /**
   * @ignore
   * @private
   */
  private returnRuleSetEarly: undefined | boolean;

  /**
   * @ignore
   * @private
   */
  private showNestedError: undefined | boolean;

  /**
   * @description
   * Creates a validator schema.
   *
   * @param objectOfRules Set of `Rule`(s). `key` should match
   * with the `key` of object being validated.
   * @param options Options for validator schema.
   */
  constructor(objectOfRules: IValidatorRuleSet, options?: IValidatorOptions) {
    if (options !== undefined) {
      if (options.returnEarly !== undefined) {
        if (typeof options.returnEarly !== "boolean") {
          throw new TypeError("`options.returnEarly` should be a boolean.");
        }

        this.returnEarly = options.returnEarly;
      }

      if (options.returnRuleSetEarly !== undefined) {
        if (typeof options.returnRuleSetEarly !== "boolean") {
          throw new TypeError(
            "`options.returnRuleSetEarly` should be a boolean.",
          );
        }

        this.returnRuleSetEarly = options.returnRuleSetEarly;
      }

      if (options.showNestedError !== undefined) {
        if (typeof options.showNestedError !== "boolean") {
          throw new TypeError("`options.showNestedError` should be a boolean.");
        }

        this.showNestedError = options.showNestedError;
      }
    }

    this.ruleSets = { ...objectOfRules };
  }

  /**
   * @description
   * Validates the `values` passed and returns `errors` object if any,
   * otherwise return `undefined` along with `values`.
   *
   * @param valuesToCheck Object of values to be checked.
   * @param options Options for validator.
   * @returns Object containing `values` and `errors`
   */
  public validate(
    valuesToCheck: IValidatorValidateValues,
    options?: IValidatorValidateOptions,
  ): IValidatorValidateReturn {
    let path: any[] = [];
    let showNestedError = this.showNestedError;
    if (!valuesToCheck || typeof valuesToCheck !== "object") {
      throw new TypeError("`valuesToCheck` should be an object.");
    }

    if (options !== undefined && typeof options !== "object") {
      throw new TypeError("`options` should be an object.");
    }

    if (options) {
      if (options.path !== undefined) {
        if (!Array.isArray(options.path)) {
          throw new TypeError("`options.path` should be an array.");
        }

        path = options.path;
      }

      if (typeof showNestedError !== "boolean") {
        if (
          options.showNestedError !== undefined &&
          typeof options.showNestedError !== "boolean"
        ) {
          throw new TypeError("`options.showNestedError` should be a boolean.");
        }
        showNestedError = options.showNestedError;
      }

      if (typeof this.returnEarly !== "boolean") {
        if (
          options.returnEarly !== undefined &&
          typeof options.returnEarly !== "boolean"
        ) {
          throw new TypeError("`options.returnEarly` should be a boolean.");
        }
        this.returnEarly = options.returnEarly;
      }

      if (typeof this.returnRuleSetEarly !== "boolean") {
        if (
          options.returnRuleSetEarly !== undefined &&
          typeof options.returnRuleSetEarly !== "boolean"
        ) {
          throw new TypeError(
            "`options.returnRuleSetEarly` should be a boolean.",
          );
        }
        this.returnRuleSetEarly = options.returnRuleSetEarly;
      }
    }

    const allErrors: IValidatorValidateReturn["errors"] = {};
    const modifiedValues: IValidatorValidateReturn["values"] = {};

    for (const key of Object.keys(this.ruleSets)) {
      let ruleSet: RuleSet;
      if (Array.isArray(this.ruleSets[key])) {
        ruleSet = new RuleSet({ rules: this.ruleSets[key] as Rule[] });
      } else if (this.ruleSets[key] instanceof Rule) {
        ruleSet = new RuleSet({ rules: this.ruleSets[key] as Rule });
      } else {
        const expandedRuleSet = this.ruleSets[key] as IValidatorRuleSetExpanded;
        ruleSet = new RuleSet({
          rules: expandedRuleSet.rules,
          label: expandedRuleSet.label,
        });
      }
      const { value, errors: currentErrors } = ruleSet.validate(
        valuesToCheck[key],
        key,
        { returnEarly: this.returnRuleSetEarly, path, showNestedError },
      );
      modifiedValues[key] = value;
      if (currentErrors) {
        allErrors[key] = currentErrors;
        if (this.returnEarly) {
          break;
        }
      }
    }

    if (Object.keys(allErrors).length > 0) {
      return { values: modifiedValues, errors: allErrors };
    }

    return { values: modifiedValues, errors: undefined };
  }
}
