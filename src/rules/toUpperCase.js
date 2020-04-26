import Rule from './Rule';

/**
 * Converts the string value to upper case
 */
export default class toUpperCase extends Rule {
  /**
   * Converts the string value to upper case
   */
  constructor() {
    super('toUpperCase');
  }

  /**
   * Validate the `value` and return the error `string` if there are any
   * otherwise return `null`.
   * @param {any} value The value to be checked.
   * @param {Object} options Options for validate.
   * @param {String} options.label Name or Label of the value being checked.
   * @param {String} options.path Validator path.
   * @returns {{ value: any, error: String }} Value and error string.
   */
  validate(value, options) {
    if (typeof options !== 'object') {
      throw new TypeError('`options` should be an object.');
    }

    if (typeof options.label !== 'string') {
      throw new TypeError('`options.label` should be a string.');
    }

    let newVal = value;
    if (typeof newVal === 'string') {
      newVal = newVal.toUpperCase();
    }

    return { value: newVal, error: null };
  }
}
