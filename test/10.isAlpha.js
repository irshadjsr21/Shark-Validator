const assert = require('assert');
const { Validator, isAlpha } = require('../lib');

const schema = new Validator({
  name: isAlpha(),
  email: isAlpha(),
  password: isAlpha({ allowSpaces: true }),
  confirmPassword: {
    rules: [isAlpha({ message: '%name% should only be alphabets.' })],
    label: 'Confirm password',
  },
});

/**
 * @test {isAlpha}
 */
describe('10. isAlpha', () => {
  describe('With invalid values', () => {
    let result;
    before(() => {
      const data = schema.validate({
        name: 'asd#!',
        email: 'ahsdg jasdg j!hasgd',
        password: 'kasjdhkaq212jsdh',
        confirmPassword: 'asd@!',
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
      assert.equal(errorArray[0].validator, 'isAlpha');
      assert.equal(errorArray[0].value, 'asd#!');
      assert.equal(errorArray[0].path, 'name');
    });

    it('Should return error if spaces are present', () => {
      const errorArray = result.email;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isAlpha');
      assert.equal(errorArray[0].value, 'ahsdg jasdg j!hasgd');
      assert.equal(errorArray[0].path, 'email');
    });

    it('Should return error if numbers are present', () => {
      const errorArray = result.password;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isAlpha');
      assert.equal(errorArray[0].value, 'kasjdhkaq212jsdh');
      assert.equal(errorArray[0].path, 'password');
    });

    it('Should return custom message on error', () => {
      const errorArray = result.confirmPassword;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isAlpha');
      assert.equal(errorArray[0].value, 'asd@!');
      assert.equal(
        errorArray[0].error,
        'Confirm password should only be alphabets.',
      );
      assert.equal(errorArray[0].path, 'confirmPassword');
    });
  });

  describe('With valid strings', () => {
    let result;
    before(() => {
      const data = schema.validate({
        name: 'irshad',
        email: 'irshadgmailcom',
        password: 'asd sad',
        confirmPassword: 'asd',
      });
      result = data.errors;
    });

    it('Should not return error', () => {
      assert.equal(result, null);
    });
  });
});
