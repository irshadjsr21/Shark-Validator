# Shark-Validator

## Overview
A tree shakable validator which for both `Nodejs` and `Browser`.

## Installation
```
npm install shark-validator
```

## Example usage
Create a schema for validation and import only the required Rules.

```js
const { Validator, RuleSet, isRequired, isString, isLen } = require('shark-validator');

const schema = new Validator({
  name: RuleSet.create([new isString(), new isRequired()]),
  email: RuleSet.create([new isString(), new isRequired()]),
  password: RuleSet.create([new isString(), new isRequired(), new isLen({ min:8 })]),
});
```

Validate values using the created schema

```js
const valuesToCheck = {
  name: 'Dan',
  email: 'dan@daninc.com',
  password: '123456'
};

const { values, errors } = schema.validate(valuesToCheck);
```

## Reference and API Documentation
[https://irshadjsr21.github.io/Shark-Validator/](https://irshadjsr21.github.io/Shark-Validator/)