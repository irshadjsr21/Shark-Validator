export default class Rule {
  constructor(name) {
    if (!name || typeof name !== 'string') {
      throw new Error('`name` is required in `Rule` class constructor.');
    }

    this.__name = name;

    if (this.constructor === Rule) {
      throw new TypeError(
        'Abstract class "Rule" cannot be instantiated directly.',
      );
    }

    if (this.validate === undefined) {
      throw new TypeError(
        'Classes extending the `Rule` must have `validate` function.',
      );
    }
  }

  validate(value, label) {}

  formatMessage(formatter, values) {
    let __values = values;
    if (!__values) __values = {};
    if (typeof __values !== 'object') {
      throw new TypeError('`values` should be an object.');
    }

    if (!formatter || typeof formatter !== 'string') {
      throw new TypeError('`formatter` should be a string.');
    }

    let newString = '';
    let key = '';
    let isBuildingKey = false;

    for (let i = 0; i < formatter.length; i++) {
      const char = formatter.charAt(i);
      switch (char) {
        case '-':
          if (i + 1 < formatter.length && formatter.charAt(i + 1) === '%') {
            newString += '%';
            i++;
          } else {
            newString += '-';
          }
          break;
        case '%':
          isBuildingKey = !isBuildingKey;
          if (isBuildingKey) {
            key = '';
          } else {
            let value = __values[key];
            if (value === null || value === undefined) {
              throw new Error(`Value of \`${key}\` is not present.`);
            }
            newString += value;
          }
          break;
        default:
          if (isBuildingKey) {
            key += char;
          } else {
            newString += char;
          }
      }
    }

    if (isBuildingKey) {
      throw new Error('Invalid pairs of `%` in `formatter`.');
    }

    return newString;
  }
}
