import Rule from './Rule';

export default class toNumber extends Rule {
  /**
   * Converts the value to Number and throws error if it cannot be converted
   */
  constructor() {
    super('toNumber');
  }

  validate(value, label) {
    const data = {
      name: label,
    };

    if (isNaN(value)) {
      return {
        value,
        error: this.formatMessage("'%name%' should be a number.", data),
      };
    }

    const num = Number.parseFloat(value);

    return { value: num, error: null };
  }
}
