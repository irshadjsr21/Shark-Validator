import RuleSet from "../RuleSet";
import { IIsArrayOfObjectOptions, IIsArrayOptions } from "../types";
import { IsArray } from "./isArray";
import isObject from "./isObject";

/**
 * @description
 * Checks if value is an array and each value satisfies the given rules
 *
 * @param {Object} options Options for `isArrayOfObject`
 */

export default function isArrayOfObject(options: IIsArrayOfObjectOptions) {
  const isArrayOptions: IIsArrayOptions = {
    rules: isObject({ schema: options.schema }),
    message: options.message,
    min: options.min,
    max: options.max,
    eq: options.eq,
  };
  return new IsArray(isArrayOptions);
}
