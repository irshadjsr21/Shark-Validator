const assert = require('assert');
const { Validator, RuleSet, isString, isRequired } = require('../lib');

/**
 * @test {Validator}
 * @test {RuleSet}
 */
describe('00. Base for all Rules', () => {
  describe('With returnEarly: true', () => {
    let result;
    before(() => {
      const schema = new Validator(
        {
          name: RuleSet.create([new isString(), new isRequired()]),
          username: RuleSet.create([new isString()]),
        },
        { returnEarly: true },
      );
      const data = schema.validate({
        name: null,
        username: undefined,
      });
      result = data.errors;
    });

    it('Should return error', () => {
      assert.equal(typeof result, 'object');
      assert.notEqual(result, null);
    });

    it('Should return error on null', () => {
      const errorArray = result.name;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 2);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isString');
      assert.equal(errorArray[0].value, null);
    });

    it('Should not return error on undefined', () => {
      const errorArray = result.username;
      assert.equal(errorArray, undefined);
    });
  });

  describe('With returnEarly: false', () => {
    let result;
    before(() => {
      const schema = new Validator(
        {
          name: RuleSet.create([new isString(), new isRequired()]),
          username: RuleSet.create([new isString()]),
        },
        { returnEarly: false },
      );

      const data = schema.validate({
        name: null,
        username: undefined,
      });
      result = data.errors;
    });

    it('Should return error', () => {
      assert.equal(typeof result, 'object');
      assert.notEqual(result, null);
    });

    it('Should return error on null', () => {
      const errorArray = result.name;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 2);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isString');
      assert.equal(errorArray[0].value, null);
    });

    it('Should return error on undefined', () => {
      const errorArray = result.username;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isString');
      assert.equal(errorArray[0].value, undefined);
    });
  });

  describe('With returnEarly: true & returnRuleSetEarly: true', () => {
    let result;
    before(() => {
      const schema = new Validator(
        {
          name: RuleSet.create([new isString(), new isRequired()]),
          username: RuleSet.create([new isString()]),
        },
        { returnEarly: true, returnRuleSetEarly: true },
      );

      const data = schema.validate({
        name: null,
        username: undefined,
      });
      result = data.errors;
    });

    it('Should return error', () => {
      assert.equal(typeof result, 'object');
      assert.notEqual(result, null);
    });

    it('Should return error on null', () => {
      const errorArray = result.name;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isString');
      assert.equal(errorArray[0].value, null);
    });

    it('Should not return error on undefined', () => {
      const errorArray = result.username;
      assert.equal(errorArray, undefined);
    });
  });

  describe('With returnEarly: false & returnRuleSetEarly: true', () => {
    let result;
    before(() => {
      const schema = new Validator(
        {
          name: RuleSet.create([new isString(), new isRequired()]),
          username: RuleSet.create([new isString()]),
        },
        { returnEarly: false, returnRuleSetEarly: true },
      );

      const data = schema.validate({
        name: null,
        username: undefined,
      });
      result = data.errors;
    });

    it('Should return error', () => {
      assert.equal(typeof result, 'object');
      assert.notEqual(result, null);
    });

    it('Should return error on null', () => {
      const errorArray = result.name;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isString');
      assert.equal(errorArray[0].value, null);
    });

    it('Should return error on undefined', () => {
      const errorArray = result.username;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isString');
      assert.equal(errorArray[0].value, undefined);
    });
  });
});
