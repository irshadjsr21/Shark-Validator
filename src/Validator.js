import RuleSet from './RuleSet';

export default class Validator {
  /**
   * Creates a validator schema.
   * @param {Object} objectOfRuleSet Object whose `key` matches with the `key` of values to be checked, and values should be an instance of `RuleSet`
   */
  constructor(objectOfRuleSet) {
    if (!objectOfRuleSet || typeof objectOfRuleSet !== 'object') {
      throw new TypeError('`objectOfRuleSet` should be an object.');
    }

    if (Object.keys(objectOfRuleSet).length <= 0) {
      throw new TypeError('`objectOfRuleSet` should not be empty.');
    }

    this.__ruleSets = { ...objectOfRuleSet };
  }

  /**
   * Validates the values and returns error object if any,
   * otherwise return `null`
   * @param {Object} valuesToCheck Object of values to be checked.
   */
  validate(valuesToCheck) {
    if (!valuesToCheck || typeof valuesToCheck !== 'object') {
      throw new TypeError('`valuesToCheck` should be an object.');
    }

    const allErrors = {};
    const modifiedValues = {};
    for (const key in this.__ruleSets) {
      const ruleSet = this.__ruleSets[key];
      if (!(ruleSet instanceof RuleSet)) {
        throw new TypeError(
          'RuleSet should be an instance of `RuleSet` class.',
        );
      }
      const { value, errors: currentErrors } = ruleSet.validate(
        valuesToCheck[key],
        key,
      );
      modifiedValues[key] = value;
      if (currentErrors) {
        allErrors[key] = currentErrors;
      }
    }

    if (Object.keys(allErrors).length > 0)
      return { values: modifiedValues, errors: allErrors };

    return { values: modifiedValues, errors: null };
  }
}
