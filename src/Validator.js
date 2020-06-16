import RuleSet from './RuleSet';

/**
 * @description
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
   * @ignore
   * @private
   */
  __showNestedError;

  /**
   * @description
   * Creates a validator schema.
   *
   * @param {Object<RuleSet>} objectOfRuleSet Set of `RuleSet`. `key` should match
   * with the `key` of object being validated.
   * @param {Object} options Options for validator schema.
   * @param {Boolean} options.returnEarly If `true` returns whenever first `key`
   * in `values` fails the test.
   * @param {Boolean} options.returnRuleSetEarly If `true` returns the after getting
   * the first error on all `keys`.
   * @param {Boolean} options.showNestedError If `true` shows nested errors.
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

      if (options.showNestedError !== undefined) {
        if (typeof options.showNestedError !== 'boolean') {
          throw new TypeError('`options.showNestedError` should be a boolean.');
        }

        this.__showNestedError = options.showNestedError;
      }
    }

    this.__ruleSets = { ...objectOfRuleSet };
  }

  /**
   * @description
   * Validates the `values` passed and returns `error` object if any,
   * otherwise return `null` along with `values`.
   *
   * @param {Object} valuesToCheck Object of values to be checked.
   * @param {Object} options Options for validator.
   * @param {String} options.path Validation path.
   * @param {Boolean} options.showNestedError If `true` shows nested errors.
   * @param {Boolean} options.returnEarly If `true` returns whenever first
   * `key` in `values` fails the test.
   * @param {Boolean} options.returnRuleSetEarly If `true` returns the after
   * getting the first error on all `keys`.
   * @returns {{values: Object, errors: Object<validationError>}} Object containing
   * `values` and `errors`
   */
  validate(valuesToCheck, options) {
    let path = '';
    let showNestedError = this.__showNestedError;
    if (!valuesToCheck || typeof valuesToCheck !== 'object') {
      throw new TypeError('`valuesToCheck` should be an object.');
    }

    if (options !== undefined && typeof options !== 'object') {
      throw new TypeError('`options` should be an object.');
    }

    if (options) {
      if (options.path !== undefined && typeof options.path !== 'string') {
        throw new TypeError('`options.path` should be a string.');
      }

      path = options.path;

      if (typeof showNestedError !== 'boolean') {
        if (
          options.showNestedError !== undefined
          && typeof options.showNestedError !== 'boolean'
        ) {
          throw new TypeError('`options.showNestedError` should be a boolean.');
        }
        showNestedError = options.showNestedError;
      }

      if (typeof this.__returnEarly !== 'boolean') {
        if (
          options.returnEarly !== undefined
          && typeof options.returnEarly !== 'boolean'
        ) {
          throw new TypeError('`options.returnEarly` should be a boolean.');
        }
        this.__returnEarly = options.returnEarly;
      }

      if (typeof this.__returnRuleSetEarly !== 'boolean') {
        if (
          options.returnRuleSetEarly !== undefined
          && typeof options.returnRuleSetEarly !== 'boolean'
        ) {
          throw new TypeError(
            '`options.returnRuleSetEarly` should be a boolean.',
          );
        }
        this.__returnRuleSetEarly = options.returnRuleSetEarly;
      }
    }

    const allErrors = {};
    const modifiedValues = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(this.__ruleSets)) {
      let ruleSet;
      if (this.__ruleSets[key].type === 'isArrayOfObject') {
        ruleSet = RuleSet.arrayOfObject(
          this.__ruleSets[key],
          this.__ruleSets[key].label,
        );
      } else if (this.__ruleSets[key].type === 'toArray') {
        ruleSet = RuleSet.array(
          this.__ruleSets[key],
          this.__ruleSets[key].label,
        );
      } else if (
        Array.isArray(this.__ruleSets[key].rules)
        && !this.__ruleSets[key].type
      ) {
        ruleSet = RuleSet.create(
          this.__ruleSets[key].rules,
          this.__ruleSets[key].label,
        );
      } else if (Array.isArray(this.__ruleSets[key])) {
        ruleSet = RuleSet.create(this.__ruleSets[key]);
      } else if (this.__ruleSets[key].schema) {
        ruleSet = RuleSet.object(
          this.__ruleSets[key],
          this.__ruleSets[key].label,
        );
      }
      if (!(ruleSet instanceof RuleSet)) {
        throw new TypeError(
          'RuleSet should be an instance of `RuleSet` class.',
        );
      }
      const { value, errors: currentErrors } = ruleSet.validate(
        valuesToCheck[key],
        key,
        { returnEarly: this.__returnRuleSetEarly, path, showNestedError },
      );
      modifiedValues[key] = value;
      if (currentErrors) {
        allErrors[key] = currentErrors;
        if (this.__returnEarly) {
          break;
        }
      }
    }

    if (Object.keys(allErrors).length > 0) {
      return { values: modifiedValues, errors: allErrors };
    }

    return { values: modifiedValues, errors: null };
  }
}
