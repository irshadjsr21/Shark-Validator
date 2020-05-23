import Rule from './Rule';

/**
 * Checks if the value is a number
 */
export default class isNumber extends Rule {
  /**
   * @ignore
   */
  message;

  /**
   * @ignore
   */
  min;

  /**
   * @ignore
   */
  max;

  /**
   * Checks if the value is a number
   * @param {Object} options Options for `isNumber`
   * @param {Number} options.min Number should be min to `min`
   * @param {Number} options.max Number should be max to `max`
   * @param {String} options.message Custom error message if test fails
   * (check {@link Rule#formatMessage} for more customization details)
   */
  constructor(options) {
    super('isNumber');

    this.min = undefined;
    this.max = undefined;
    this.message = undefined;
    if (options !== undefined && typeof options !== 'object') {
      throw new TypeError('`options` should be an object.');
    }

    if (options !== undefined) {
      const keys = ['min', 'max'];
      // eslint-disable-next-line no-restricted-syntax
      for (const key of keys) {
        if (options[key] !== undefined && typeof options[key] !== 'number') {
          throw new TypeError(
            `\`${key}\` key in options should be an integer.`,
          );
        }
      }

      if (
        options.message !== undefined
        && typeof options.message !== 'string'
      ) {
        throw new Error('`message` key in `options` should be a string.');
      }

      this.min = options.min;
      this.max = options.max;
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
      min: this.min,
      max: this.max,
    };

    // eslint-disable-next-line no-restricted-globals
    if (isNaN(value)) {
      return {
        value,
        error: this.message
          ? this.formatMessage(this.message, data)
          : this.formatMessage("'%name%' should be a number.", data),
      };
    }

    const num = Number.parseFloat(value);

    if (
      this.min !== undefined
      && this.max !== undefined
      && (num > this.max || num < this.min)
    ) {
      return {
        value,
        error: this.message
          ? this.formatMessage(this.message, data)
          : this.formatMessage(
            "'%name%' should be a between %min% - %max%.",
            data,
          ),
      };
    }

    if (this.min !== undefined && num < this.min) {
      return {
        value,
        error: this.message
          ? this.formatMessage(this.message, data)
          : this.formatMessage("'%name%' should not be less than %min%.", data),
      };
    }

    if (this.max !== undefined && num > this.max) {
      return {
        value,
        error: this.message
          ? this.formatMessage(this.message, data)
          : this.formatMessage(
            "'%name%' should not be greater than %max%.",
            data,
          ),
      };
    }

    return { value, error: null };
  }
}
