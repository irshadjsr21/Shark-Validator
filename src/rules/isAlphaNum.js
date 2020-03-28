import Rule from './Rule';

export default class isAlphaNum extends Rule {
  /**
   * Checks if the value matches the regular expression.
   * @param {Object} options Options for `isAlphaNum`
   * @param {Boolean} options.allowSpaces If `true`, it allows spaces
   * @param {String} options.message Custom error message if test fails
   */
  constructor(options) {
    super('isAlphaNum');
    let allowedString = 'a-z0-9';
    this.message = undefined;
    this.allowSpaces = false;

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

      if (
        options.allowSpaces !== undefined &&
        typeof options.allowSpaces !== 'boolean'
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

  validate(value, label) {
    if (typeof value === 'string') {
      const data = {
        name: label,
      };

      if (!this.regex.test(value))
        return {
          value,
          error: this.message
            ? this.formatMessage(this.message, data)
            : this.formatMessage(
                "'%name%' should contain only alphabets and numbers.",
                data,
              ),
        };
    }
    return { value, error: null };
  }
}
