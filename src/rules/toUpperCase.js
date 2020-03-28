import Rule from './Rule';

export default class toUpperCase extends Rule {
  /**
   * Converts the string value to upper case
   */
  constructor() {
    super('toUpperCase');
  }

  validate(value) {
    let newVal = value;
    if (typeof newVal === 'string') {
      newVal = newVal.toUpperCase();
    }

    return { value: newVal, error: null };
  }
}
