import isObject from './isObject';
import { IsArray } from './isArray';
import RuleSet from '../RuleSet';

/**
 * Checks if value is an array and each value satisfies the given rules
 * @param {Validator} schema A `Validator` object to be checked against the object
 * @param {String} label The name or label of the value being checked
 * @param {Object} schemaOptions Options for `isArray`
 * @param {Number} schemaOptions.eq Length should be equal to `eq`
 * @param {Number} schemaOptions.min Length should be min `min`
 * @param {Number} schemaOptions.max Length should be max to `max`
 * @param {String} schemaOptions.message Custom error message if test fails
 * (check {@link Rule#formatMessage} for more customization details)
 * @returns {RuleSet} A new `RuleSet` object
 */

export default function isArrayOfObject(schema, label, schemaOptions) {
  let objectOptions = {};
  let objOpt = {};
  if (schemaOptions) {
    objectOptions = { ...schemaOptions };
    objOpt = { ...schemaOptions };
  }
  objectOptions.rules = new RuleSet(isObject(schema));

  objOpt.rules = new IsArray(objectOptions);
  objOpt.label = label;
  return objOpt;
}
