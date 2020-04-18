import RuleSet from './RuleSet';

/**
 * Creates a Validator.
 */
export default class Validator {
  /**
   * @ignore
   * @private
   */
  __ruleSets;

  /**
   * @ignore
   * @private
   */
  __returnEarly;

  /**
   * @ignore
   * @private
   */
  __returnRuleSetEarly;

  /**
   * Creates a validator schema.
   * @param {Object<RuleSet>} objectOfRuleSet Set of `RuleSet`. `key` should match with the `key` of object being validated.
   * @param {Object} options Options for validator schema.
   * @param {Boolean} options.returnEarly If `true` returns whenever first `key` in `values` fails the test.
   * @param {Boolean} options.returnRuleSetEarly If `true` returns the after getting the first error on all `keys`.
   */
  constructor(objectOfRuleSet, options) {
    if (!objectOfRuleSet || typeof objectOfRuleSet !== 'object') {
      throw new TypeError('`objectOfRuleSet` should be an object.');
    }

    if (Object.keys(objectOfRuleSet).length <= 0) {
      throw new TypeError('`objectOfRuleSet` should not be empty.');
    }

    if (options !== undefined) {
      if (typeof options !== 'object') {
        throw new TypeError('`options` should be an object.');
      }

      if (options.returnEarly !== undefined) {
        if (typeof options.returnEarly !== 'boolean') {
          throw new TypeError('`options.returnEarly` should be a boolean.');
        }

        this.__returnEarly = options.returnEarly;
      }

      if (options.returnRuleSetEarly !== undefined) {
        if (typeof options.returnRuleSetEarly !== 'boolean') {
          throw new TypeError(
            '`options.returnRuleSetEarly` should be a boolean.',
          );
        }

        this.__returnRuleSetEarly = options.returnRuleSetEarly;
      }
    }

    this.__ruleSets = { ...objectOfRuleSet };
  }

  /**
   * Validates the `values` passed and returns `error` object if any,
   * otherwise return `null` along with `values`.
   * @param {Object} valuesToCheck Object of values to be checked.
   * @returns {{values: Object, errors: Object<validationError>}} Object containing `values` and `errors`
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
        { returnEarly: this.__returnRuleSetEarly },
      );
      modifiedValues[key] = value;
      if (currentErrors) {
        allErrors[key] = currentErrors;
        if (this.__returnEarly) {
          break;
        }
      }
    }

    if (Object.keys(allErrors).length > 0)
      return { values: modifiedValues, errors: allErrors };

    return { values: modifiedValues, errors: null };
  }
}
