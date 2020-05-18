import Rule from './Rule';

/**
 * Converts the value to an integer and throws error if it cannot be converted
 */
export default class toInt extends Rule {
  /**
   * @ignore
   */
  message;

  /**
   * Converts the value to an integer and throws error if it cannot be converted
   * @param {Object} options Options for `toInt`
   * @param {String} options.message Custom error message if test fails
   * (check {@link Rule#formatMessage} for more customization details)
   */
  constructor(options) {
    super('toInt');

    this.message = undefined;
    if (options !== undefined && typeof options !== 'object') {
      throw new TypeError('`options` should be an object.');
    }

    if (options !== undefined) {
      if (
        options.message !== undefined
        && typeof options.message !== 'string'
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

    const { label } = options;

    const data = {
      name: label,
    };

    // eslint-disable-next-line no-restricted-globals
    if (isNaN(value)) {
      return {
        value,
        error: this.message
          ? this.formatMessage(this.message, data)
          : this.formatMessage("'%name%' should be an integer.", data),
      };
    }

    const floatNum = Number.parseFloat(value);

    if (!Number.isInteger(floatNum)) {
      return {
        value,
        error: this.message
          ? this.formatMessage(this.message, data)
          : this.formatMessage("'%name%' should be an integer.", data),
      };
    }

    const num = Number.parseInt(floatNum, 10);

    return { value: num, error: null };
  }
}
