import { IRuleValidateOptions, IRuleValidateReturn } from "../types";
import Rule from "./Rule";

/**
 * @description
 * Converts the string value to lower case
 */
class ToLowerCase extends Rule {
  /**
   * @description
   * Converts the string value to lower case
   */
  constructor() {
    super("toLowerCase");
  }

  /**
   * @description
   * Validate the `value` and return the error `string` if there are any
   * otherwise return `undefined`.
   *
   * @param value The value to be checked.
   * @param options Options for validate.
   */
  public validate(
    value: any,
    options: IRuleValidateOptions,
  ): IRuleValidateReturn {
    if (typeof options !== "object") {
      throw new TypeError("`options` should be an object.");
    }

    if (typeof options.label !== "string") {
      throw new TypeError("`options.label` should be a string.");
    }

    let newVal = value;
    if (typeof newVal === "string") {
      newVal = newVal.toLowerCase();
    }

    return { value: newVal, error: undefined };
  }
}

/**
 * @description
 * Converts the string value to lower case
 */
export default function toLowerCase() {
  return new ToLowerCase();
}
