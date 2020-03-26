import Rule from './Rule';

export default class isRequired extends Rule {
  /**
   * Requires the field to be non empty.
   */
  constructor() {
    super('isRequired');
  }

  validate(value, label) {
    if (
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value === '')
    ) {
      return {
        value,
        error: this.formatMessage("'%name%' should not be empty.", {
          name: label,
        }),
      };
    }
    return { value, error: null };
  }
}
