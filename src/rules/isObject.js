import Rule from './Rule';
import Validator from '../Validator';

/**
 * @description
 * Checks if the value is an object and satisfies the given schema
 */
class IsObject extends Rule {
  /**
   * @ignore
   */
  message;

  /**
   * @ignore
   */
  schema;

  /**
   * @description
   * Checks if the value is an object and satisfies the given schema
   *
   * @param {Object} options Options for `isObject`
   * @param {Validator} options.schema Schema for the object
   * @param {String} options.message Custom error message if test fails
   * (check {@link Rule#formatMessage} for more customization details)
   */
  constructor(options) {
    super('isObject');

    this.message = undefined;
    this.schema = undefined;

    if (options !== undefined && typeof options !== 'object') {
      throw new TypeError('`options` should be an object.');
    }

    if (options !== undefined) {
      if (
        options.message !== undefined
        && typeof options.message !== 'string'
      ) {
        throw new Error('`message` key in `options` should be a string.');
      }

      this.message = options.message;

      if (
        options.schema !== undefined
        && !(options.schema instanceof Validator)
      ) {
        throw new Error(
          '`schema` key in `options` should be an instance of class `Validator`.',
        );
      }

      this.schema = options.schema;
    }
  }

  /**
   * @description
   * Validate the `value` and return the error `string` if there are any
   * otherwise return `null`.
   *
   * @param {any} value The value to be checked.
   * @param {Object} options Options for validate.
   * @param {String} options.label Name or Label of the value being checked.
   * @param {String} options.path Validator path.
   * @param {Boolean} options.showNestedError If `true` shows nested errors.
   * @param {Boolean} options.returnEarly If `true` returns the after getting the first error.
   * @returns {{ value: any, error: String }} Value and error string.
   */
  validate(value, options) {
    let showNestedError;

    if (typeof options !== 'object') {
      throw new TypeError('`options` should be an object.');
    }

    if (typeof options.label !== 'string') {
      throw new TypeError('`options.label` should be a string.');
    }

    const { label } = options;

    if (typeof options.path !== 'string') {
      throw new TypeError('`options.path` should be a string.');
    }

    const { path } = options;

    if (options.showNestedError !== undefined) {
      if (typeof options.showNestedError !== 'boolean') {
        throw new TypeError('`options.showNestedError` should be a boolean.');
      }

      showNestedError = options.showNestedError;
    }

    const data = {
      name: label,
    };

    if (typeof value !== 'object') {
      return {
        value,
        error: this.message
          ? this.formatMessage(this.message, data)
          : this.formatMessage("'%name%' should be an object.", data),
      };
    }

    const { errors, values } = this.schema.validate(value, {
      path,
      showNestedError,
      returnRuleSetEarly: options.returnEarly,
    });

    if (errors && Object.keys(errors).length > 0) {
      return {
        value: values,
        error: errors,
      };
    }

    return { value: values, error: null };
  }
}

/**
 * Create a ruleset for a particular `key` or `value` if it is supposed to be an object.
 * Can be used as an alternative to the constructor.
 * @param {Validator} schema A `Validator` object to be checked against the object
 * @param {String} label The name or label of the value being checked
 * @param {Object} schemaOptions Options for `isObject`
 * @param {String} schemaOptions.message Custom error message if test fails
 * (check {@link Rule#formatMessage} for more customization details)
 * @returns {RuleSet} A new `RuleSet` object
 */

export default function isObject(schema, label, schemaOptions) {
  let objectOptions = {};
  if (schemaOptions) {
    objectOptions = { ...schemaOptions };
  }
  objectOptions.schema = schema;
  objectOptions.rules = [new IsObject(objectOptions)];
  objectOptions.label = label;
  return objectOptions;
}
