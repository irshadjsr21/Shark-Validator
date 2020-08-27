import {
  Validator,
  isString,
  isRequired,
  isEmail,
  toLowerCase,
  isArrayOfObject,
} from 'shark-validator';

const userSchema = new Validator(
  {
    name: [isRequired(), isString(), toLowerCase()],
    email: [isRequired(), isString(), isEmail(), toLowerCase()],
  },
  { returnRuleSetEarly: true },
);

const schema = new Validator({
  users: {
    rules: isArrayOfObject({
      schema: userSchema,
      min: 1,
      max: 3,
    }),
    label: null,
  },
});

const { errors, values } = schema.validate(
  { users: [{ name: 'hello' }, { email: 'hi' }] },
  { returnRuleSetEarly: true },
);

console.log(errors);
console.log(values);
