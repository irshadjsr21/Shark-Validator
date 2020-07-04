const assert = require('assert');
const { Validator, isRequired } = require('../lib');

const schema = new Validator({
  name: isRequired(),
  email: isRequired(),
  password: isRequired(),
  confirmPassword: {
    rules: [isRequired({ message: '%name% is to be present.' })],
    label: 'Confirm password',
  },
});

/**
 * @test {isRequired}
 */
describe('02. isRequired', () => {
  describe('With null, undefined and empty string', () => {
    let result;
    before(() => {
      const data = schema.validate({
        name: null,
        email: undefined,
        password: '',
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
      assert.equal(errorArray[0].validator, 'isRequired');
      assert.equal(errorArray[0].value, null);
      assert.equal(errorArray[0].path, 'name');
    });

    it('Should return error on undefined', () => {
      const errorArray = result.email;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isRequired');
      assert.equal(errorArray[0].value, undefined);
      assert.equal(errorArray[0].path, 'email');
    });

    it('Should return error on empty string', () => {
      const errorArray = result.password;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isRequired');
      assert.equal(errorArray[0].value, '');
      assert.equal(errorArray[0].path, 'password');
    });

    it('Should return custom message on error', () => {
      const errorArray = result.confirmPassword;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isRequired');
      assert.equal(errorArray[0].value, null);
      assert.equal(errorArray[0].error, 'Confirm password is to be present.');
      assert.equal(errorArray[0].path, 'confirmPassword');
    });
  });

  describe('With valid strings', () => {
    let result;
    before(() => {
      const data = schema.validate({
        name: 'irshad',
        email: 'irshad@gmail.com',
        password: '12345678',
        confirmPassword: '12345678',
      });
      result = data.errors;
    });

    it('Should not return error', () => {
      assert.equal(result, null);
    });
  });
});
