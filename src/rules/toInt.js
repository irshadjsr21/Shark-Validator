import Rule from './Rule';

export default class toInt extends Rule {
  /**
   * Converts the value to an integer and throws error if it cannot be converted
   * @param {Object} options Options for `toInt`
   * @param {String} options.message Custom error message if test fails
   */
  constructor(options) {
    super('toInt');

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

  validate(value, label) {
    const data = {
      name: label,
    };

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

    const num = Number.parseInt(floatNum);

    return { value: num, error: null };
  }
}
