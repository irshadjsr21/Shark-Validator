import Rule from './Rule';

export default class isString extends Rule {
  /**
   * Required the field to be a `string`
   * @param {Object} options Options for `isString`
   * @param {String} options.message Custom error message if test fails
   */
  constructor(options) {
    super('isString');

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
    if (typeof value !== 'string') {
      const data = {
        name: label,
      };

      return {
        value,
        error: this.message
          ? this.formatMessage(this.message, data)
          : this.formatMessage("'%name%' should be a string.", data),
      };
    }
    return { value, error: null };
  }
}
