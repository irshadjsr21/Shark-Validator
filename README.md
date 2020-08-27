# Shark-Validator

![Node.js CI](https://github.com/irshadjsr21/Shark-Validator/workflows/Node.js%20CI/badge.svg?branch=master) [![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

## Overview

A light weight, powerful, tree shakable javascript schema validator which works on both `Nodejs` and `Browser`.

## Table of Contents

1. [Installation](#installation)
2. [Importing](#importing)
3. [Quick start](#quick-start)
4. [More fetures](#more-fetures)
5. [Reference and API Documentation](#reference-and-api-documentation)

## Installation

```
npm install shark-validator
```

## Importing

Remeber to import everything from the `shark-validator` directly for tree shaking to work.

#### ES6

```js
import {
  Validator,
  RuleSet,
  isRequired,
  isString,
  isLen,
} from "shark-validator";
```

#### CommonJS

```js
const {
  Validator,
  RuleSet,
  isRequired,
  isString,
  isLen,
} = require("shark-validator/lib");
```

## Quick start

There are 2 classes in `shark-validator` you need to know:

- `Validator` - The validation schema that will be used to validate a set of values.
- `Rule` - There are a lot of predefined Rules that you can use or create your own Rule by extending the `Rule` class.

Some predefined rules are `isString`, `isRequired` and `isLen`. You can lookup more predefined rules here [https://shark.imirshad.com/](https://shark.imirshad.com/).

### Example usage

Here we'll create a validator schema to validate for `name`, `email` and `password`. We have to create a set of `Rule(s)` for each key in this schema.

The rules we'll use in this example are:

- `isString`: It makes sure that the value is a string.
- `isRequired`: It makes sure that the value is present.
- `isEmail`: It makes sure that the value is an email.
- `isLen`: It makes sure that the value is of a particular length.

```js
const {
  Validator,
  isRequired,
  isString,
  isLen,
  isEmail,
} = require("shark-validator/lib");

const schema = new Validator({
  name: [isRequired(), isString()],
  email: [isRequired(), isString(), isEmail()],
  password: [isRequired(), isString(), isLen({ min: 8 })],
});
```

Now our validation schema is created which we can use to test any value. To test a particular object we can use the `validate` method of `schema` as shown below.

```js
const valuesToCheck = {
  name: "Dan",
  email: "dandaninc.com",
  password: "123456",
};

const { values, errors } = schema.validate(valuesToCheck);
```

The `validate` methods returns an object with `values` and `errros` (if any otherwise `undefined`). The value of the variable `values` and `errors` will be.

**Values**

```json
{
  "name": "Dan",
  "email": "dan@daninc.com",
  "password": "123456"
}
```

**Errors**

```json
{
  "email": [
    {
      "error": "'email' should be a valid email.",
      "validator": "isEmail",
      "value": "dandaninc.com",
      "path": "email"
    }
  ],

  "password": [
    {
      "error": "'password' should not be less than 8 characters.",
      "validator": "isLen",
      "value": "123456",
      "path": "password"
    }
  ]
}
```

The `errors` object contains all the data about which rule failed and where did it fail.

As in this example we can see that the `email` key failed to validate on `isEmail` rule and the password field failed to validate on `isLen` rule.

The `errors` object contains the following data:

- `error`: Error message.
- `validator`: Name of the `Rule` where the error occured.
- `value`: The value on which the rule failed.
- `path`: Path to the value.

## More fetures

### Custom label

You can provide a custom name to a particular key which can be displayed on the error message if the test for that key fails.

##### Example

If in the above example we defined the `email` key as:

```js
email: { rules: [isRequired(), isString(), isEmail()], label: "Business Email" }
```

Then the returned error message will use the name `Business Email`.

```json
{
  "email":
    [
      { "error": "'Business Email' should be a valid email.",
        "validator": "isEmail",
        "value": "dandaninc.com",
        "path": "email"
      }
    ],

  ...
}
```

### Return early

If you want to stop the check if one error is found, then you can pass in an additional parameters `returnEarly` and `returnRuleSetEarly` to the `Validator` constructor.

If set to true, then the functionality of the two parameters will be:

- `returnEarly`: Stops validating when other keys when one or more errors are found for a particular key.
- `returnRuleSetEarly`: Stops further validation of a particular key if an error is found on the same key.

You can use a combination of both the parameters to acheive different funtionalities.

##### Example

If the validator is defined as below.

```js
const schema = new Validator(
  {
    name: [isRequired(), isString()],
    email: [isRequired(), isString(), isEmail()],
    password: [isRequired(), isString(), isLen({ min: 8 })],
  },
  {
    returnEarly: true,
  },
);
```

Then the errors object will be:

```json
{
  "email": [
    {
      "error": "'Business Email' should be a valid email.",
      "validator": "isEmail",
      "value": "dandaninc.com",
      "path": "email"
    }
  ]
}
```

Notice that no `password` error is returned because the validation stopped when the email failed the test.

### Custom error message

If you don't like the existing error messages, you can provide custom error messages if a particular rule fails just by adding a parameter `message` to the `Rule` constructor as:

```js
[someRule({ message: "Please provide a valid input." })];
```

Additionally you can use some variable inside the message string like `name` of the field. To use a variable you just have to enclose the name of the variable between `%`, like this.

```js
[someRule({ message: "Please provide a valid input for %name%." })];
```

Other then the `name` valriable, you can use any other variable that you provide in the `Rule` constructor along with the message.

##### Example

If in the above example we defined the `password` key as:

```js
password: [
  isRequired(),
  isString(),
  isLen({
    min: 8,
    message: "%name% must be equal to or greater than %min% charecters.",
  }),
];
```

Then the returned error will use our custom message.

```json
{
  "password":
    [
      { "error": "password must be equal to or greater than 8 charecters.",
        "validator": "isLen",
        "value": "123456",
        "path": "password"
      }
    ],

  ...
}
```

### Validating objects

You can validate objects with `isObject` rule. You can also nest mustiple object with this rule.

To achieve this you need to create a seperate schema for the object you are validating and use it inside the `isObject` rule.

##### Example

```js
const addressSchema = new Validator({
  city: [isRequired(), isString()],
  state: [isRequired(), isString()],
});
```

Now you can use this `addressSchema` in your main validation schema.

```js
const schema = new Validator({
  name: [isRequired(), isString()],
  address: isObject({ schema: addressSchema }),
});

const { values, errors } = schema.validate(valuesToCheck);
```

You can check additional parameters in `isObject` documentation.

### Validating arrays

You can validate arrays with `isArray` rule.

You have to define a set of rules to validate each array element and you can also specify the range of array length.

##### Example

```js
const schema = new Validator({
  name: [isRequired(), isString()],
  emails: isArray({ rules: [isRequired(), isString(), isEmail()] }),
});

const { values, errors } = schema.validate(valuesToCheck);
```

You can check additional parameters in `isArray` documentation.

### Validating array of objects

You can validate array of objects with `isArrayOfObject` rule. You can also nest mustiple object with this method.

To achieve this you need to create a seperate schema for the object you are validating and use it inside the `isArrayOfObject` rule.

##### Example

```js
const addressSchema = new Validator({
  city: [isRequired(), isString()],
  state: [isRequired(), isString()],
});
```

Now you can use this `addressSchema` in your main validation schema.

```js
const schema = new Validator({
  name: [isRequired(), isString()],
  addresses: isArrayOfObject({ schema: addressSchema }),
});

const { values, errors } = schema.validate(valuesToCheck);
```

You can check additional parameters in `isArrayOfObject` documentation.

## Reference and API Documentation

Checkout the reference and API documentation for more features. [https://shark.imirshad.com/](https://shark.imirshad.com/)
