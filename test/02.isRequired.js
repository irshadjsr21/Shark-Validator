const assert = require('assert');
const { Validator, RuleSet } = require('../lib');
const { isRequired } = require('../lib/rules');

const schema = new Validator({
  name: RuleSet.create([new isRequired()]),
  email: RuleSet.create([new isRequired()]),
  password: RuleSet.create([new isRequired()]),
});

describe('isRequired', () => {
  describe('With null, undefined and empty string', () => {
    let result;
    before(() => {
      result = schema.validate({
        name: null,
        email: undefined,
        password: '',
      });
    });

    it('Should return error', () => {
      assert.equal(typeof result, 'object');
    });

    it('Should return error on null', () => {
      const errorArray = result.name;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isRequired');
      assert.equal(errorArray[0].value, null);
    });

    it('Should return error on undefined', () => {
      const errorArray = result.email;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isRequired');
      assert.equal(errorArray[0].value, undefined);
    });

    it('Should return error on empty string', () => {
      const errorArray = result.password;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isRequired');
      assert.equal(errorArray[0].value, '');
    });
  });

  describe('With valid strings', () => {
    let result;
    before(() => {
      result = schema.validate({
        name: 'irshad',
        email: 'irshad@gmail.com',
        password: '12345678',
      });
    });

    it('Should not return error', () => {
      assert.equal(result, null);
    });
  });
});
