import { Rule } from './rules';

export default class RuleSet {
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

  static create(label, rules) {
    return new RuleSet(label, rules);
  }

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
