const assert = require('assert');
const { Validator, RuleSet, isIn } = require('../lib');

const schema = new Validator({
  name: RuleSet.create([new isIn({ in: ['irshad', 'ansari'] })]),
  yearOfBirth: RuleSet.create([new isIn({ in: [2018, 2019] })]),
  username: RuleSet.create([new isIn({ in: ['irshad'] })]),
});

describe('isIn', () => {
  describe('With error values', () => {
    let result;
    before(() => {
      result = schema.validate({
        name: 'irsh',
        yearOfBirth: '20181',
        username: 'ir',
      });
    });

    it('Should return error', () => {
      assert.equal(typeof result, 'object');
    });

    it('Should return error if not in given strings', () => {
      const errorArray = result.name;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isIn');
      assert.equal(errorArray[0].value, 'irsh');
    });

    it('Should return error if not in given numbers', () => {
      const errorArray = result.yearOfBirth;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isIn');
      assert.equal(errorArray[0].value, '20181');
    });

    it('Should return error if not in given single string', () => {
      const errorArray = result.username;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isIn');
      assert.equal(errorArray[0].value, 'ir');
    });
  });

  describe('With valid values', () => {
    let result;
    before(() => {
      result = schema.validate({
        name: 'irshad',
        yearOfBirth: 2018,
        username: 'irshad',
      });
    });

    it('Should not return error', () => {
      assert.equal(result, null);
    });
  });
});
