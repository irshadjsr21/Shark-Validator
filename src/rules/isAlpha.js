import Rule from './Rule';

/**
 * Checks if the value contains only Alphabets.
 */
export default class isAlpha extends Rule {
  /**
   * @ignore
   */
  message;

  /**
   * @ignore
   */
  allowSpaces;

  /**
   * @ignore
   */
  regex;

  /**
   * Checks if the value contains only Alphabets.
   * @param {Object} options Options for `isAlpha`
   * @param {Boolean} options.allowSpaces If `true`, it allows spaces
   * @param {String} options.message Custom error message if test fails
   * (check {@link Rule#formatMessage} for more customization details)
   */
  constructor(options) {
    super('isAlpha');
    let allowedString = 'a-z';
    this.message = undefined;
    this.allowSpaces = false;

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

      if (
        options.allowSpaces !== undefined
        && typeof options.allowSpaces !== 'boolean'
      ) {
        throw new Error('`allowSpaces` key in `options` should be a boolean.');
      }
      this.message = options.message;
      this.allowSpaces = options.allowSpaces;
      if (this.allowSpaces) {
        allowedString += '\\s';
      }
    }

    this.regex = new RegExp(`^[${allowedString}]*$`, 'i');
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

    if (typeof value === 'string') {
      const data = {
        name: label,
      };

      if (!this.regex.test(value)) {
        return {
          value,
          error: this.message
            ? this.formatMessage(this.message, data)
            : this.formatMessage(
              "'%name%' should contain only alphabets.",
              data,
            ),
        };
      }
    }
    return { value, error: null };
  }
}
