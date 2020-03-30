import Rule from './Rule';

/**
 * Converts the string value to lower case
 */
export default class toLowerCase extends Rule {
  /**
   * Converts the string value to lower case
   */
  constructor() {
    super('toLowerCase');
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
      newVal = newVal.toLowerCase();
    }

    return { value: newVal, error: null };
  }
}
