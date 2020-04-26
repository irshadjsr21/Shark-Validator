import Rule from './Rule';

/**
 * Checks if the value is a valid email address.
 */
export default class isEmail extends Rule {
  /**
   * @ignore
   */
  message;

  /**
   * @ignore
   */
  regex;

  /**
   * Checks if the value is a valid email address.
   * @param {Object} options Options for `isEmail`
   * @param {String} options.message Custom error message if test fails (check {@link Rule#formatMessage} for more customization details)
   */
  constructor(options) {
    super('isEmail');
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

    this.regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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

    const label = options.label;

    if (typeof value === 'string') {
      const data = {
        name: label,
      };

      if (!this.regex.test(value))
        return {
          value,
          error: this.message
            ? this.formatMessage(this.message, data)
            : this.formatMessage("'%name%' should be a valid email.", data),
        };
    }
    return { value, error: null };
  }
}
