import Rule from './Rule';

export default class isString extends Rule {
  /**
   * Required the field to be a `string`
   */
  constructor() {
    super('isString');
  }

  validate(value, label) {
    if (typeof value !== 'string') {
      return this.formatMessage("'%name%' should be a string.", { name: label });
    }
    return null;
  }
}
