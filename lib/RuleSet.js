import { Rule } from './rules';

export default class RuleSet {
  /**
   * Create a ruleset for a particular `key` or `value`
   * @param {String} label The name or label of the value being checked
   * @param {Array} arrayOfRules Array of `Rule` objects
   */
  constructor(label, arrayOfRules) {
    if (label && typeof label !== 'string') {
      throw new TypeError('`label` should be a string.');
    }

    if (!arrayOfRules || !Array.isArray(arrayOfRules)) {
      throw new TypeError('`arrayOfRules` should be an array.');
    }

    if (arrayOfRules.length <= 0) {
      throw new TypeError('`arrayOfRules` should not be empty.');
    }

    this.__rules = [...arrayOfRules];
    this.__label = label;
  }

  /**
   * Create a ruleset for a particular `key` or `value`
   * @param {String} label The name or label of the value being checked
   * @param {Array} arrayOfRules Array of `Rule` objects
   */
  static create(label, arrayOfRules) {
    return new RuleSet(label, arrayOfRules);
  }

  /**
   * Validates the `value` and returns an array of errors if any,
   * othewise returns `null`.
   * @param {any} value Value to be validated
   */
  validate(value) {
    const errors = [];
    for (const rule of this.__rules) {
      if (!(rule instanceof Rule)) {
        throw new TypeError('Rule should be an instance of `Rule` class.');
      }
      const error = rule.validate(value, this.__label);
      if (error) errors.push({ error, validator: rule.__name, value });
    }

    if (errors.length > 0) return errors;
    return null;
  }
}
