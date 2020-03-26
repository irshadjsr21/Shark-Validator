const assert = require('assert');
const { Validator, RuleSet, isLen } = require('../lib');

const schema = new Validator({
  name: RuleSet.create([new isLen({ eq: 5 })]),
  yearOfBirth: RuleSet.create([new isLen({ eq: 4 })]),
  username: RuleSet.create([new isLen({ min: 3 })]),
  email: RuleSet.create([new isLen({ max: 10 })]),
  password: RuleSet.create([new isLen({ min: 8, max: 10 })]),
  confirmPassword: RuleSet.create([new isLen({ min: 8, max: 10 })]),
});

describe('isLen', () => {
  describe('With error values', () => {
    let result;
    before(() => {
      const data = schema.validate({
        name: 'irsh',
        yearOfBirth: '20181',
        username: 'ir',
        email: 'irshad@gmail.com',
        password: '1234567',
        confirmPassword: '12345678910',
      });
      result = data.errors;
    });

    it('Should return error', () => {
      assert.equal(typeof result, 'object');
      assert.notEqual(result, null);
    });

    it('Should return error if less than `eq`', () => {
      const errorArray = result.name;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isLen');
      assert.equal(errorArray[0].value, 'irsh');
    });

    it('Should return error if greater than `eq`', () => {
      const errorArray = result.yearOfBirth;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isLen');
      assert.equal(errorArray[0].value, '20181');
    });

    it('Should return error if less than `min`', () => {
      const errorArray = result.username;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isLen');
      assert.equal(errorArray[0].value, 'ir');
    });

    it('Should return error if greater than `max`', () => {
      const errorArray = result.email;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isLen');
      assert.equal(errorArray[0].value, 'irshad@gmail.com');
    });

    it('Should return error if less than `min` when both `min` & `max` are present', () => {
      const errorArray = result.password;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isLen');
      assert.equal(errorArray[0].value, '1234567');
    });

    it('Should return error if greater than `max` when both `min` & `max` are present', () => {
      const errorArray = result.confirmPassword;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isLen');
      assert.equal(errorArray[0].value, '12345678910');
    });
  });

  describe('With valid values', () => {
    let result;
    before(() => {
      const data = schema.validate({
        name: 'irsha',
        yearOfBirth: '2018',
        username: 'irs',
        email: 'irs@mil.in',
        password: '12345678',
        confirmPassword: '123456789',
      });
      result = data.errors;
    });

    it('Should not return error', () => {
      assert.equal(result, null);
    });
  });
});
