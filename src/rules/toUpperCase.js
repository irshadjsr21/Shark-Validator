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
   * @returns {{ value: any, error: String }} Value and error string.
   */
  validate(value) {
    let newVal = value;
    if (typeof newVal === 'string') {
      newVal = newVal.toUpperCase();
    }

    return { value: newVal, error: null };
  }
}
