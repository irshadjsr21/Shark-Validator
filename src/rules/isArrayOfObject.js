import isObject from './isObject';
import { IsArray } from './isArray';
import RuleSet from '../RuleSet';

/**
 * @description
 * Checks if value is an array and each value satisfies the given rules
 *
 * @param {Object} options Options for `isArray`
 * @param {Validator} options.schema A `Validator` object to be checked against the object
 * @param {Number} options.eq Length should be equal to `eq`
 * @param {Number} options.min Length should be min `min`
 * @param {Number} options.max Length should be max to `max`
 * @param {String} options.message Custom error message if test fails
 * (check {@link Rule#formatMessage} for more customization details)
 */

export default function isArrayOfObject(options) {
  const objectOptions = { ...options };
  const rules = isObject({ schema: options.schema });
  objectOptions.rules = new RuleSet({ rules });
  return new IsArray(objectOptions);
}
