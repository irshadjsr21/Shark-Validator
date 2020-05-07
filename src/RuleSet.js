import { Rule, isObject } from './rules';
import Validator from './Validator';

/**
 * Vaidation error object.
 * @typedef {Object} validationError
 * @property {String} error - Error string
 * @property {String} validator - Name of validator (`Rule`) where the error occured
 * @property {Any} value - Value which caused the `Rule` to fail
 */

/**
 * Creates a set of rules for a single key.
 */
class RuleSet {
  /**
   * @ignore
   * @private
   */
  __rules;

  /**
   * @ignore
   * @private
   */
  __label;

  /**
   * Create a ruleset for a particular `key` or `value`.
   * @param {Object} options Options for `RuleSet`.
   * @param {Array<Rule>} options.rules Array of `Rule` object (should not be set if the key is an obejct)
   * @param {Validator} options.schema Validator object (only if the key is an object)
   * @param {String} options.label The name or label of the value being checked
   * @param {Object} options.schemaOptions Options for `isObject`
   */
  constructor(options) {
    if (typeof options !== 'object') {
      throw new TypeError('`options` should be an object.');
    }

    if (options.label && typeof options.label !== 'string') {
      throw new TypeError('`options.label` should be a string.');
    }

    const isSchema = options.rules === undefined;

    if (isSchema) {
      if (!(options.schema instanceof Validator)) {
        throw new TypeError(
          '`options.schema` should be an instance of `Validator`.',
        );
      }

      let objectOptions = {};
      if (options.schemaOptions) {
        objectOptions = { ...options.schemaOptions };
      }

      objectOptions.schema = options.schema;
      this.__rules = [new isObject(objectOptions)];
    } else {
      if (!Array.isArray(options.rules)) {
        throw new TypeError('`options.rules` should be an array of `Rule`.');
      }

      if (options.rules.length <= 0) {
        throw new TypeError('`options.rules` should not be empty.');
      }

      this.__rules = [...options.rules];
    }

    this.__label = options.label;
  }

  /**
   * Validates the `value` and returns an array of errors if any,
   * othewise returns `null`.
   *
   * @param {any} valueToCheck Value to be validated
   * @param {String} key Key of the value being checked
   * @param {Object} options Options for validate
   * @param {Object} options.returnEarly If `true` returns the after getting the first error.
   * @param {String} options.path Validation path.
   * @param {Boolean} options.showNestedError If `true` shows nested errors.
   * @returns {validationError[]} An object containing `value` and `errors` if any
   */
  validate(valueToCheck, key, options) {
    let errors = [];
    let modifiedValue = valueToCheck;
    let returnEarly = false;
    let path = null;
    let showNestedError = false;

    if (options !== undefined) {
      if (typeof options !== 'object') {
        throw new TypeError('`options` should be an object.');
      }

      if (options.returnEarly !== undefined) {
        if (typeof options.returnEarly !== 'boolean') {
          throw new TypeError('`options.returnEarly` should be a boolean.');
        }

        returnEarly = options.returnEarly;
      }

      if (options.path !== undefined) {
        if (typeof options.path !== 'string') {
          throw new TypeError('`options.path` should be a string.');
        }

        path = options.path;
      }

      if (options.showNestedError !== undefined) {
        if (typeof options.showNestedError !== 'boolean') {
          throw new TypeError('`options.showNestedError` should be a boolean.');
        }

        showNestedError = options.showNestedError;
      }
    }

    for (const rule of this.__rules) {
      if (!(rule instanceof Rule)) {
        throw new TypeError('Rule should be an instance of `Rule` class.');
      }

      let currentPath = path ? `${path}.${key}` : key;
      const { value, error } = rule.validate(modifiedValue, {
        label: this.__label || key,
        path: currentPath,
        showNestedError,
      });

      modifiedValue = value;

      if (error) {
        if (!showNestedError && typeof error === 'object') {
          for (const innerKey in error) {
            if (error[innerKey]) {
              errors = errors.concat(error[innerKey]);
            }
          }
        } else
          errors.push({
            error,
            validator: rule.__name,
            value,
            path: currentPath,
          });
        if (returnEarly) break;
      }
    }

    if (errors.length > 0) return { value: modifiedValue, errors };
    return { value: modifiedValue, errors: null };
  }

  /**
   * Create a ruleset for a particular `key` or `value`.
   * Can be used as an alternative to the constructor.
   * @param {Array<Rule>} rules Array of `Rule` object
   * @param {String} label The name or label of the value being checked
   * @returns {RuleSet} A new `RuleSet` object
   */
  static create(rules, label) {
    return new RuleSet({ rules, label });
  }

  /**
   * Create a ruleset for a particular `key` or `value` if it is supposed to be an object.
   * Can be used as an alternative to the constructor.
   * @param {Validator} schema Array of `Rule` object
   * @param {String} label The name or label of the value being checked
   * @param {Object} schemaOptions Options for `isObject`
   * @param {String} schemaOptions.message Custom error message if test fails (check {@link Rule#formatMessage} for more customization details)
   * @returns {RuleSet} A new `RuleSet` object
   */
  static object(schema, label, schemaOptions) {
    return new RuleSet({ schema, label, schemaOptions });
  }
}

export default RuleSet;
