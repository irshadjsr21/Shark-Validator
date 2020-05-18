import Rule from './Rule';
import RuleSet from '../RuleSet';

/**
 * Checks if value is an array and each value satisfies the given rules
 */
export default class isArray extends Rule {
  /**
   * @ignore
   */
  message;

  /**
   * @ignore
   */
  rules;

  /**
   * @ignore
   */
  max;

  /**
   * @ignore
   */
  min;

  /**
   * @ignore
   */
  eq;

  /**
   * Checks if value is an array and each value satisfies the given rules
   * @param {Object} options Options for `isArray`
   * @param {RuleSet} options.rules RuleSet for validating array value
   * @param {Number} options.eq Length should be equal to `eq`
   * @param {Number} options.min Length should be min `min`
   * @param {Number} options.max Length should be max to `max`
   * @param {String} options.message Custom error message if test fails (check {@link Rule#formatMessage} for more customization details)
   */
  constructor(options) {
    super('isArray');

    this.message = undefined;
    this.rules = undefined;

    if (typeof options !== 'object') {
      throw new TypeError('`options` should be an object.');
    }

    if (options.message !== undefined && typeof options.message !== 'string') {
      throw new Error('`options.message` key in `options` should be a string.');
    }

    this.message = options.message;

    if (options.rules !== undefined && !(options.rules instanceof RuleSet)) {
      throw new Error(
        '`options.rules` key in `options` should be an instance of class `RuleSet`.',
      );
    }

    this.rules = options.rules;

    const keys = ['min', 'max', 'eq'];
    for (const key of keys) {
      if (options[key] !== undefined && typeof options[key] !== 'number') {
        throw new TypeError(`\`${key}\` key in options should be an integer.`);
      }
    }

    this.min = options.min;
    this.max = options.max;
    this.eq = options.eq;
  }

  /**
   * Validate the `value` and return the error `string` if there are any
   * otherwise return `null`.
   * @param {any} value The value to be checked.
   * @param {Object} options Options for validate.
   * @param {String} options.label Name or Label of the value being checked.
   * @param {String} options.key Key of the value being checked
   * @param {String} options.path Validator path.
   * @param {Boolean} options.showNestedError If `true` shows nested errors.
   * @param {Boolean} options.returnEarly If `true` returns the after getting the first error.
   * @returns {{ value: any, error: String }} Value and error string.
   */
  validate(value, options) {
    let showNestedError = undefined;

    if (typeof options !== 'object') {
      throw new TypeError('`options` should be an object.');
    }

    if (typeof options.label !== 'string') {
      throw new TypeError('`options.label` should be a string.');
    }

    const label = options.label;

    if (typeof options.path !== 'string') {
      throw new TypeError('`options.path` should be a string.');
    }

    const path = options.path;

    if (options.showNestedError !== undefined) {
      if (typeof options.showNestedError !== 'boolean') {
        throw new TypeError('`options.showNestedError` should be a boolean.');
      }

      showNestedError = options.showNestedError;
    }

    const data = {
      name: label,
      max: this.max,
      min: this.min,
      eq: this.eq,
    };

    if (!Array.isArray(value)) {
      return {
        value,
        error: this.message
          ? this.formatMessage(this.message, data)
          : this.formatMessage("'%name%' should be an array.", data),
      };
    }

    const len = value.length;

    if (this.eq !== undefined && len !== this.eq) {
      return {
        value,
        error: this.message
          ? this.formatMessage(this.message, data)
          : this.formatMessage("'%name%' should contain %eq% elements.", data),
      };
    }

    if (
      this.min !== undefined &&
      this.max !== undefined &&
      (len > this.max || len < this.min)
    ) {
      return {
        value,
        error: this.message
          ? this.formatMessage(this.message, data)
          : this.formatMessage(
              "'%name%' should have %min% - %max% elements.",
              data,
            ),
      };
    }

    if (this.min !== undefined && len < this.min) {
      return {
        value,
        error: this.message
          ? this.formatMessage(this.message, data)
          : this.formatMessage(
              "'%name%' should have greater than %min% elements.",
              data,
            ),
      };
    }

    if (this.max !== undefined && len > this.max) {
      return {
        value,
        error: this.message
          ? this.formatMessage(this.message, data)
          : this.formatMessage(
              "'%name%' should have less than %max% elements.",
              data,
            ),
      };
    }

    let allErrors = {};
    const allValues = [];

    for (let i = 0; i < len; i++) {
      const { errors, value: localValue } = this.rules.validate(
        value[i],
        options.key,
        {
          path: path + `[${i}]`,
          showNestedError,
          isArrayElem: true,
          returnEarly: options.returnEarly,
        },
      );
      if (errors && Object.keys(errors).length > 0) {
        allErrors[i] = errors;
        if (options.returnEarly) {
          return {
            value: allValues.concat(value.slice(i + 1)),
            error: allErrors,
          };
        }
      }
      allValues.push(localValue);
    }

    if (allErrors && Object.keys(allErrors).length > 0) {
      return {
        value: allValues,
        error: allErrors,
      };
    }

    return { value: allValues, error: null };
  }
}
