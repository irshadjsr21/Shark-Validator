import Rule from './Rule';

export default class toInt extends Rule {
  /**
   * Converts the value to an integer and throws error if it cannot be converted
   */
  constructor() {
    super('toInt');
  }

  validate(value, label) {
    const data = {
      name: label,
    };

    if (isNaN(value)) {
      return {
        value,
        error: this.formatMessage("'%name%' should be an integer.", data),
      };
    }

    const floatNum = Number.parseFloat(value);

    if (!Number.isInteger(floatNum)) {
      return {
        value,
        error: this.formatMessage("'%name%' should be an integer.", data),
      };
    }

    const num = Number.parseInt(floatNum);

    return { value: num, error: null };
  }
}
