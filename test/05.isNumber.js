const assert = require('assert');
const { Validator, RuleSet, isNumber } = require('../lib');

const schema = new Validator({
  id: RuleSet.create([new isNumber()]),
  age: RuleSet.create([new isNumber()]),
  yearOfBirth: RuleSet.create([new isNumber()]),
  monthOfBirth: RuleSet.create([new isNumber({ min: 6 })]),
  dateOfBirth: RuleSet.create([new isNumber({ max: 31 })]),
  score: RuleSet.create([new isNumber({ min: 0, max: 10.5 })]),
  avgScore: RuleSet.create([new isNumber({ min: 0, max: 100.77 })]),
});

describe('isNumber', () => {
  describe('With error values', () => {
    let result;
    before(() => {
      const data = schema.validate({
        id: '201a4',
        age: '~10',
        yearOfBirth: '20181.01a',
        monthOfBirth: '5',
        dateOfBirth: '55',
        score: '-10',
        avgScore: '150',
      });
      result = data.errors;
    });

    it('Should return error', () => {
      assert.equal(typeof result, 'object');
      assert.notEqual(result, null);
    });

    it('Should return error if character is present', () => {
      const errorArray = result.id;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isNumber');
      assert.equal(errorArray[0].value, '201a4');
    });

    it('Should return error if a symbol is present', () => {
      const errorArray = result.age;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isNumber');
      assert.equal(errorArray[0].value, '~10');
    });

    it('Should return error if character after `.`', () => {
      const errorArray = result.yearOfBirth;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isNumber');
      assert.equal(errorArray[0].value, '20181.01a');
    });

    it('Should return error if less than `min`', () => {
      const errorArray = result.monthOfBirth;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isNumber');
      assert.equal(errorArray[0].value, '5');
    });

    it('Should return error if greater than `max`', () => {
      const errorArray = result.dateOfBirth;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isNumber');
      assert.equal(errorArray[0].value, '55');
    });

    it('Should return error if less than `min` when both `min` & `max` are present', () => {
      const errorArray = result.score;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isNumber');
      assert.equal(errorArray[0].value, '-10');
    });

    it('Should return error if greater than `max` when both `min` & `max` are present', () => {
      const errorArray = result.avgScore;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isNumber');
      assert.equal(errorArray[0].value, '150');
    });
  });

  describe('With valid values', () => {
    let result;
    before(() => {
      const data = schema.validate({
        id: '10.12',
        age: 1.0,
        yearOfBirth: 2018,
        monthOfBirth: '8',
        dateOfBirth: '30',
        score: '10.15',
        avgScore: '50.65',
      });
      result = data.errors;
    });

    it('Should not return error', () => {
      assert.equal(result, null);
    });
  });
});
