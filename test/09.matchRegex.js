const assert = require('assert');
const { Validator, matchRegex } = require('../lib');

const schema = new Validator({
  email: matchRegex({ regex: new RegExp('^[a-zA-Z]*$') }),
  password: {
    rules: [
      matchRegex({
        message: '%name% should only contain alphabets.',
        regex: new RegExp('^[a-zA-Z]*$'),
      }),
    ],
    label: 'Password',
  },
});

/**
 * @test {matchRegex}
 */
describe('09. matchRegex', () => {
  describe('With error values', () => {
    let result;
    before(() => {
      const data = schema.validate({
        email: 'Asdk!#sa',
        password: 'asD.asd.',
      });
      result = data.errors;
    });

    it('Should return error', () => {
      assert.equal(typeof result, 'object');
      assert.notEqual(result, null);
    });

    it('Should return error if regex fails', () => {
      const errorArray = result.email;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'matchRegex');
      assert.equal(errorArray[0].value, 'Asdk!#sa');
      assert.equal(errorArray[0].path, 'email');
    });

    it('Should return custom message on error', () => {
      const errorArray = result.password;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'matchRegex');
      assert.equal(errorArray[0].value, 'asD.asd.');
      assert.equal(
        errorArray[0].error,
        'Password should only contain alphabets.',
      );
      assert.equal(errorArray[0].path, 'password');
    });
  });

  describe('With valid values', () => {
    let result;
    before(() => {
      const data = schema.validate({
        name: 'irShad',
        password: 'Asdas',
      });
      result = data.errors;
    });

    it('Should not return error', () => {
      assert.equal(result, null);
    });
  });
});
