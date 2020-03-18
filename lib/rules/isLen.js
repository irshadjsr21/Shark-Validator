import Rule from './Rule';

export default class isLen extends Rule {
  constructor(options) {
    super('isLen');
    if (!options || typeof options !== 'object') {
      throw new TypeError('`options` should be an object.');
    }

    if (Object.keys(options).length <= 0) {
      throw new Error(
        '`options` should have atleast one of `min`, `max` or `eq` key.',
      );
    }
    const keys = ['min', 'max', 'eq'];
    for (const key of keys) {
      if (options[key] !== undefined && typeof options[key] !== 'number') {
        throw new TypeError(`\`${key}\` key in options should be an integer.`);
      }
    }
    this.min = options.min;
    this.max = options.max;
    this.eq = options.eq;
  }

  validate(value, label) {
    if (typeof value === 'string') {
      const len = value.length;
      const data = {
        name: label,
        min: this.min,
        max: this.max,
        eq: this.eq,
      };

      if (this.eq && len !== this.eq) {
        return this.formatMessage(
          "'%name%' should be %eq% characters long.",
          data,
        );
      }

      if (this.min && this.max && (len > this.max || len < this.min)) {
        return this.formatMessage(
          "'%name%' should be a between %min% - %max% characters.",
          data,
        );
      }

      if (this.min && len < this.min) {
        return this.formatMessage(
          "'%name%' should not be less than %min% characters.",
          data,
        );
      }

      if (this.max && len > this.max) {
        return this.formatMessage(
          "'%name%' should not be greater than %max% characters.",
          data,
        );
      }
    }
    return null;
  }
}
