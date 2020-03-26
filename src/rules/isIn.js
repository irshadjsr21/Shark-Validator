import Rule from './Rule';

export default class isIn extends Rule {
  /**
   * Checks if the value is in the given array (works for number and strings) (is type sensitive)
   * @param {Object} options Options for `isIn`
   * @param {Array} options.in Array containing possible values
   * @param {String} options.message Custom error message if test fails
   */
  constructor(options) {
    super('isIn');
    if (!options || typeof options !== 'object') {
      throw new TypeError('`options` should be an object.');
    }

    if (Object.keys(options).length <= 0) {
      throw new Error('`options` should have `in` key.');
    }

    if (!options.in || !Array.isArray(options.in)) {
      throw new Error('`in` key in `options` should be an array.');
    }

    if (options.message !== undefined && typeof options.message !== 'string') {
      throw new Error('`message` key in `options` should be a string.');
    }

    this.in = options.in;
    this.message = options.message;
  }

  validate(value, label) {
    const data = {
      name: label,
      in: this.in.join(', '),
    };
    const errorMsg = this.message
      ? this.formatMessage(this.message, data)
      : this.formatMessage("'%name%' should be one of '%in%'.", data);

    if (
      (typeof value !== 'string' && typeof value !== 'number') ||
      !this.in.includes(value)
    ) {
      return { value, error: errorMsg };
    }

    return { value, error: null };
  }
}
