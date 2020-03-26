import Rule from './Rule';

export default class isNumber extends Rule {
  /**
   * Checks if the value is a number
   * @param {Object} options Options for `isNumber`
   * @param {Number} options.min Number should be min to `min`
   * @param {Number} options.max Number should be max to `max`
   */
  constructor(options) {
    super('isNumber');

    this.min = undefined;
    this.max = undefined;
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

      this.min = options.min;
      this.max = options.max;
    }
  }

  validate(value, label) {
    const data = {
      name: label,
      min: this.min,
      max: this.max,
    };

    if (isNaN(value)) {
      return this.formatMessage("'%name%' should be a number.", data);
    }

    const num = Number.parseFloat(value);

    if (
      this.min !== undefined &&
      this.max !== undefined &&
      (num > this.max || num < this.min)
    ) {
      return this.formatMessage(
        "'%name%' should be a between %min% - %max%.",
        data,
      );
    }

    if (this.min !== undefined && num < this.min) {
      return this.formatMessage(
        "'%name%' should not be less than %min%.",
        data,
      );
    }

    if (this.max !== undefined && num > this.max) {
      return this.formatMessage(
        "'%name%' should not be greater than %max%.",
        data,
      );
    }

    return null;
  }
}
