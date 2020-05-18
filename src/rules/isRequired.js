import Rule from './Rule';

/**
 * Requires the field to be non empty.
 */
export default class isRequired extends Rule {
  /**
   * @ignore
   */
  message;

  /**
   * Requires the field to be non empty.
   * @param {Object} options Options for `isRequired`
   * @param {String} options.message Custom error message if test fails
   * (check {@link Rule#formatMessage} for more customization details)
   *
   */
  constructor(options) {
    super('isRequired');

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

    if (
      value === null
      || value === undefined
      || (typeof value === 'string' && value === '')
    ) {
      const data = {
        name: label,
      };
      return {
        value,
        error: this.message
          ? this.formatMessage(this.message, data)
          : this.formatMessage("'%name%' should not be empty.", data),
      };
    }
    return { value, error: null };
  }
}
