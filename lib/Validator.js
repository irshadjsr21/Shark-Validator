import RuleSet from './RuleSet';

export default class Validator {
  constructor(objectOfRuleSet) {
    if (!objectOfRuleSet || typeof objectOfRuleSet !== 'object') {
      throw new TypeError('`objectOfRuleSet` should be an object.');
    }

    if (Object.keys(objectOfRuleSet).length <= 0) {
      throw new TypeError('`objectOfRuleSet` should not be empty.');
    }

    this.__ruleSets = { ...objectOfRuleSet };
  }

  validate(values) {
    if (!values || typeof values !== 'object') {
      throw new TypeError('`values` should be an object.');
    }

    if (Object.keys(values).length <= 0) {
      throw new TypeError('`values` should not be empty.');
    }

    const errors = {};

    for (const key in values) {
      const ruleSet = this.__ruleSets[key];
      if (!(ruleSet instanceof RuleSet)) {
        throw new TypeError(
          'RuleSet should be an instance of `RuleSet` class.',
        );
      }
      const error = ruleSet.validate(values[key]);
      if (error) {
        errors[key] = error;
      }
    }

    if (Object.keys(errors).length > 0) return errors;
    return null;
  }
}
