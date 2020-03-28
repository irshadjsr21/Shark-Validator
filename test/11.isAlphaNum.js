const assert = require('assert');
const { Validator, RuleSet, isAlphaNum } = require('../lib');

const schema = new Validator({
  name: RuleSet.create([new isAlphaNum({ allowSpaces: true })]),
  email: RuleSet.create([new isAlphaNum()]),
  password: RuleSet.create(
    [new isAlphaNum({ message: '%name% should only be a-z or 0-9.' })],
    'Password',
  ),
});

describe('11. isAlphaNum', () => {
  describe('With invalid values', () => {
    let result;
    before(() => {
      const data = schema.validate({
        name: 'as12d#!',
        email: 'ahsdg jasd2g jhasgd',
        password: 'kasjdh!kaq212jsdh',
      });
      result = data.errors;
    });

    it('Should return error', () => {
      assert.equal(typeof result, 'object');
      assert.notEqual(result, null);
    });

    it('Should return error if symbols are present', () => {
      const errorArray = result.name;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isAlphaNum');
      assert.equal(errorArray[0].value, 'as12d#!');
    });

    it('Should return error if spaces are present', () => {
      const errorArray = result.email;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isAlphaNum');
      assert.equal(errorArray[0].value, 'ahsdg jasd2g jhasgd');
    });

    it('Should return custom message on error', () => {
      const errorArray = result.password;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isAlphaNum');
      assert.equal(errorArray[0].value, 'kasjdh!kaq212jsdh');
      assert.equal(
        errorArray[0].error,
        'Password should only be a-z or 0-9.',
      );
    });
  });

  describe('With valid strings', () => {
    let result;
    before(() => {
      const data = schema.validate({
        name: 'irshad2 ansari',
        email: 'irshadgmailco2m',
        password: 'asdsad',
      });
      result = data.errors;
    });

    it('Should not return error', () => {
      assert.equal(result, null);
    });
  });
});
