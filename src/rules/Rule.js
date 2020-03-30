/**
 * Rule class should be extended in order to create any rule.
 * @abstract
 */
export default class Rule {
  /**
   * @private
   * @type {String} Name of the `Rule`
   */
  __name;

  /**
   * `Rule` is an abstract class which must be extended in order to
   * create a Rule. The subclass must have a `validate` function.
   * @param {String} name Name of the Rule being defined.
   */
  constructor(name) {
    if (!name || typeof name !== 'string') {
      throw new Error('`name` is required in `Rule` class constructor.');
    }

    this.__name = name;

    if (this.constructor === Rule) {
      throw new TypeError(
        'Abstract class "Rule" cannot be instantiated directly.',
      );
    }

    if (this.validate === undefined) {
      throw new TypeError(
        'Classes extending the `Rule` must have `validate` function.',
      );
    }
  }

  /**
   * @abstract
   * Validate the `value` and return the error `string` if there are any
   * otherwise return `null`.
   * @param {any} value The value to be checked.
   * @param {String} label Name or Label of the value being checked.
   * @returns {{ value: any, error: String }} Value and error string.
   */
  validate(value, label) {}

  /**
   * This formats the formatter string and includes the variables in it
   * from `values` object.
   * The variable key must be surrounded by `%` char.
   * 
   * @param {String} formatter The format string.
   * @param {Object} values Object containing `key` and `value` pairs used in formatter `string`.
   * @returns {String} Returns formatted string
   * 
   * @example
   * const formattedString = formatMessage('%name% should not be empty.', { name: 'Email' });
   * // Returns 'Email should not be empty.'
   * 
   * @example
   * // If the message contains actual `%` symbol, it should be prefixed with `-`.
   * 
   * const formattedString = formatMessage('%name% should be greater than 90-%.', { name: 'Marks' });
   * // Returns 'Marks should be greater than 90%.'
   */
  formatMessage(formatter, values) {
    let __values = values;
    if (!__values) __values = {};
    if (typeof __values !== 'object') {
      throw new TypeError('`values` should be an object.');
    }

    if (!formatter || typeof formatter !== 'string') {
      throw new TypeError('`formatter` should be a string.');
    }

    let newString = '';
    let key = '';
    let isBuildingKey = false;

    for (let i = 0; i < formatter.length; i++) {
      const char = formatter.charAt(i);
      switch (char) {
        case '-':
          if (i + 1 < formatter.length && formatter.charAt(i + 1) === '%') {
            newString += '%';
            i++;
          } else {
            newString += '-';
          }
          break;
        case '%':
          isBuildingKey = !isBuildingKey;
          if (isBuildingKey) {
            key = '';
          } else {
            let value = __values[key];
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
      throw new Error('Invalid pairs of `%` in `formatter`.');
    }

    return newString;
  }
}
