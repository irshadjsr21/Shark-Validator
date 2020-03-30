import Rule from './Rule';

/**
 * Converts the value to Number and throws error if it cannot be converted
 */
export default class toNumber extends Rule {
  /**
   * @ignore
   */
  message;

  /**
   * Converts the value to Number and throws error if it cannot be converted
   * @param {Object} options Options for `toInt`
   * @param {String} options.message Custom error message if test fails (check {@link Rule#formatMessage} for more customization details)
   */
  constructor(options) {
    super('toNumber');

    this.message = undefined;
    if (options !== undefined && typeof options !== 'object') {
      throw new TypeError('`options` should be an object.');
    }

    if (options !== undefined) {
      if (
        options.message !== undefined &&
        typeof options.message !== 'string'
      ) {
        throw new Error('`message` key in `options` should be a string.');
      }

      this.message = options.message;
    }
  }

  /**
   * Validate the `value` and return the error `string` if there are any
   * otherwise return `null`.
   * @param {any} value The value to be checked.
   * @param {String} label Name or Label of the value being checked.
   * @returns {{ value: any, error: String }} Value and error string.
   */
  validate(value, label) {
    const data = {
      name: label,
    };

    if (isNaN(value)) {
      return {
        value,
        error: this.message
          ? this.formatMessage(this.message, data)
          : this.formatMessage("'%name%' should be a number.", data),
      };
    }

    const num = Number.parseFloat(value);

    return { value: num, error: null };
  }
}
