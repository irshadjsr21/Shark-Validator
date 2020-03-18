# Shark-Validator

## Overview
A tree shakable validator which for both `Nodejs` and `Browser`.

## Example usage
Create a schema for validation and import only the required Rules.

```js
const { Validator, RuleSet } = require('shark-validator');
const { isRequired, isString, isLen } = require('shark-validator/rules');

const schema = new Validator({
  name: RuleSet.create([new isString(), new isRequired()]),
  email: RuleSet.create([new isString(), new isRequired()]),
  password: RuleSet.create([new isString(), new isRequired(), new isLen({ min:8 })]),
});
```

Validate values using the created schema

```js
const values = {
  name: 'Dan',
  email: 'dan@daninc.com',
  password: '123456'
};

schema.validate(values) // Returns error object if error otherwise return `null`
```
