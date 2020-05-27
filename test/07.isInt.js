const assert = require('assert');
const { Validator, RuleSet, isInt } = require('../lib');

const schema = new Validator({
  id: RuleSet.create([isInt()]),
  age: RuleSet.create([isInt()]),
  yearOfBirth: RuleSet.create([isInt()]),
  monthOfBirth: RuleSet.create([isInt({ min: 6 })]),
  dateOfBirth: RuleSet.create([isInt({ max: 31 })]),
  score: RuleSet.create([isInt({ min: 0, max: 10 })]),
  avgScore: RuleSet.create([isInt({ min: 0, max: 100 })]),
  maxScore: RuleSet.create(
    [
      isInt({
        min: 0,
        max: 100,
        message: '%name% should be in the range of %min% to %max%',
      }),
    ],
    'Max Score',
  ),
});

/**
 * @test {isInt}
 */
describe('07. isInt', () => {
  describe('With error values', () => {
    let result;
    before(() => {
      const data = schema.validate({
        id: '2014.05',
        age: '~10',
        yearOfBirth: '20181.01a',
        monthOfBirth: '5',
        dateOfBirth: '55',
        score: '-10',
        avgScore: '150',
        maxScore: '187',
      });
      result = data.errors;
    });

    it('Should return error', () => {
      assert.equal(typeof result, 'object');
      assert.notEqual(result, null);
    });

    it('Should return error if decimal number', () => {
      const errorArray = result.id;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isInt');
      assert.equal(errorArray[0].value, '2014.05');
      assert.equal(errorArray[0].path, 'id');
    });

    it('Should return error if a symbol is present', () => {
      const errorArray = result.age;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isInt');
      assert.equal(errorArray[0].value, '~10');
      assert.equal(errorArray[0].path, 'age');
    });

    it('Should return error if character is present', () => {
      const errorArray = result.yearOfBirth;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isInt');
      assert.equal(errorArray[0].value, '20181.01a');
      assert.equal(errorArray[0].path, 'yearOfBirth');
    });

    it('Should return error if less than `min`', () => {
      const errorArray = result.monthOfBirth;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isInt');
      assert.equal(errorArray[0].value, '5');
      assert.equal(errorArray[0].path, 'monthOfBirth');
    });

    it('Should return error if greater than `max`', () => {
      const errorArray = result.dateOfBirth;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isInt');
      assert.equal(errorArray[0].value, '55');
      assert.equal(errorArray[0].path, 'dateOfBirth');
    });

    it('Should return error if less than `min` when both `min` & `max` are present', () => {
      const errorArray = result.score;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isInt');
      assert.equal(errorArray[0].value, '-10');
      assert.equal(errorArray[0].path, 'score');
    });

    it('Should return error if greater than `max` when both `min` & `max` are present', () => {
      const errorArray = result.avgScore;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isInt');
      assert.equal(errorArray[0].value, '150');
      assert.equal(errorArray[0].path, 'avgScore');
    });

    it('Should return custom message on error', () => {
      const errorArray = result.maxScore;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isInt');
      assert.equal(errorArray[0].value, '187');
      assert.equal(
        errorArray[0].error,
        'Max Score should be in the range of 0 to 100',
      );
      assert.equal(errorArray[0].path, 'maxScore');
    });
  });

  describe('With valid values', () => {
    let result;
    before(() => {
      const data = schema.validate({
        id: '10',
        age: 1.0,
        yearOfBirth: 2018,
        monthOfBirth: '8',
        dateOfBirth: '30',
        score: '10',
        avgScore: '0',
        maxScore: '100',
      });
      result = data.errors;
    });

    it('Should not return error', () => {
      assert.equal(result, null);
    });
  });
});
