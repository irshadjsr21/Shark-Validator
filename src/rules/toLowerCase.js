import Rule from './Rule';

export default class toLowerCase extends Rule {
  /**
   * Converts the string value to lower case
   */
  constructor() {
    super('toLowerCase');
  }

  validate(value) {
    let newVal = value;
    if (typeof newVal === 'string') {
      newVal = newVal.toLowerCase();
    }

    return { value: newVal, error: null };
  }
}
