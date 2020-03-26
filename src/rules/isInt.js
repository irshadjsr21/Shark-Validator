import Rule from './Rule';

export default class isInt extends Rule {
  /**
   * Checks if the value is an integer
   * @param {Object} options Options for `isInt`
   * @param {Number} options.min Number should be min to `min`
   * @param {Number} options.max Number should be max to `max`
   * @param {String} options.message Custom error message if test fails
   */
  constructor(options) {
    super('isInt');

    this.min = undefined;
    this.max = undefined;
    this.message = undefined;
    if (options !== undefined && typeof options !== 'object') {
      throw new TypeError('`options` should be an object.');
    }

    if (options !== undefined) {
      const keys = ['min', 'max'];
      for (const key of keys) {
        if (options[key] !== undefined && typeof options[key] !== 'number') {
          throw new TypeError(
            `\`${key}\` key in options should be an integer.`,
          );
        }
      }

      if (
        options.message !== undefined &&
        typeof options.message !== 'string'
      ) {
        throw new Error('`message` key in `options` should be a string.');
      }

      this.min = options.min;
      this.max = options.max;
      this.message = options.message;
    }
  }

  validate(value, label) {
    const data = {
      name: label,
      min: this.min,
      max: this.max,
    };

    if (isNaN(value)) {
      return {
        value,
        error: this.message
          ? this.formatMessage(this.message, data)
          : this.formatMessage("'%name%' should be an integer.", data),
      };
    }

    const num = Number.parseFloat(value);

    if (!Number.isInteger(num)) {
      return {
        value,
        error: this.message
          ? this.formatMessage(this.message, data)
          : this.formatMessage("'%name%' should be an integer.", data),
      };
    }

    if (
      this.min !== undefined &&
      this.max !== undefined &&
      (num > this.max || num < this.min)
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
