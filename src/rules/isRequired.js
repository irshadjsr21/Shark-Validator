import Rule from './Rule';

export default class isRequired extends Rule {
  /**
   * Requires the field to be non empty.
   * @param {Object} options Options for `isRequired`
   * @param {String} options.message Custom error message if test fails
   */
  constructor(options) {
    super('isRequired');

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
    if (
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value === '')
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
