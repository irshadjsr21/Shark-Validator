import {
  IRuleFormatterValues,
  IRuleValidateOptions,
  IRuleValidateReturn,
} from "../types";
/**
 * @description
 * Rule class should be extended in order to create any rule.
 *
 * @abstract
 */
export default class Rule {
  /**
   * @private
   * @type {String} Name of the `Rule`
   */
  public name: string;

  /**
   * @description
   * `Rule` is an abstract class which must be extended in order to
   * create a Rule. The subclass must have a `validate` function.
   *
   * @param {String} name Name of the Rule being defined.
   */
  constructor(name: string) {
    this.name = name;

    if (this.constructor === Rule) {
      throw new TypeError(
        'Abstract class "Rule" cannot be instantiated directly.',
      );
    }

    if (this.validate === undefined) {
      throw new TypeError(
        "Classes extending the `Rule` must have `validate` function.",
      );
    }
  }

  /**
   * @abstract
   *
   * @description
   * Validate the `value` and return the error `string` if there are any
   * otherwise return `undefined`.
   *
   * @param value The value to be checked.
   * @param label Name or Label of the value being checked.
   * @returns Value and error.
   */
  public validate(value: any, options: IRuleValidateOptions): IRuleValidateReturn {
    // To be overridden
    return { value: undefined, error: undefined };
  }

  /**
   * @description
   * This formats the formatter string and includes the variables in it
   * from `values` object.
   * The variable key must be surrounded by `%` char.
   *
   * @param formatter The format string.
   * @param values Object containing `key` and `value` pairs used in formatter `string`.
   * @returns Returns formatted string
   *
   * @example
   * ```js
   * const formattedString = formatMessage('%name% should not be empty.', { name: 'Email' });
   * // Returns 'Email should not be empty.'
   * ```
   *
   * @example
   * ```js
   * // If the message contains actual `%` symbol, it should be prefixed with `-`.
   * const formattedString = formatMessage('%name% should be greater than 90-%.',
   *  { name: 'Marks' }
   * );
   * // Returns 'Marks should be greater than 90%.'
   * ```
   */
  public formatMessage(formatter: string, values: IRuleFormatterValues): string {
    let valuesObj = values;
    if (!valuesObj) {
      valuesObj = {};
    }
    if (typeof valuesObj !== "object") {
      throw new TypeError("`values` should be an object.");
    }

    if (!formatter || typeof formatter !== "string") {
      throw new TypeError("`formatter` should be a string.");
    }

    let newString = "";
    let key = "";
    let isBuildingKey = false;

    for (let i = 0; i < formatter.length; i += 1) {
      const char = formatter.charAt(i);
      switch (char) {
        case "-":
          if (i + 1 < formatter.length && formatter.charAt(i + 1) === "%") {
            newString += "%";
            i += 1;
          } else {
            newString += "-";
          }
          break;
        case "%":
          isBuildingKey = !isBuildingKey;
          if (isBuildingKey) {
            key = "";
          } else {
            const value = valuesObj[key];
            if (value === null || value === undefined) {
              throw new Error(`Value of \`${key}\` is not present.`);
            }
            newString += value;
          }
          break;
        default:
          if (isBuildingKey) {
            key += char;
          } else {
            newString += char;
          }
      }
    }

    if (isBuildingKey) {
      throw new Error("Invalid pairs of `%` in `formatter`.");
    }

    return newString;
  }
}
