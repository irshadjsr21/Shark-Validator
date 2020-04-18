# Shark-Validator
![Node.js CI](https://github.com/irshadjsr21/Shark-Validator/workflows/Node.js%20CI/badge.svg?branch=master)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

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
[https://shark.imirshad.com/](https://shark.imirshad.com/)