const assert = require('assert');
const { Validator, isEmail } = require('../lib');

const schema = new Validator({
  email1: [isEmail()],
  email2: [isEmail()],
  email3: {
    rules: [isEmail({ message: '%name% is not an email.' })],
    label: 'Email',
  },
});

/**
 * @test {isEmail}
 */
describe('14. isEmail', () => {
  describe('With invalid values', () => {
    let result;
    before(() => {
      const data = schema.validate({
        email1: 'irshad',
        email2: 'irshad@',
        email3: 'irshad@gmail',
      });
      result = data.errors;
    });

    it('Should return error', () => {
      assert.equal(typeof result, 'object');
      assert.notEqual(result, null);
    });

    it('Should return error if only user name', () => {
      const errorArray = result.email1;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isEmail');
      assert.equal(errorArray[0].value, 'irshad');
      assert.equal(errorArray[0].path, 'email1');
    });

    it('Should return error if only user name with @', () => {
      const errorArray = result.email2;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isEmail');
      assert.equal(errorArray[0].value, 'irshad@');
      assert.equal(errorArray[0].path, 'email2');
    });

    it('Should return error if top level domain is missing', () => {
      const errorArray = result.email3;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isEmail');
      assert.equal(errorArray[0].value, 'irshad@gmail');
      assert.equal(errorArray[0].path, 'email3');
    });

    it('Should return custom message on error', () => {
      const errorArray = result.email3;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isEmail');
      assert.equal(errorArray[0].error, 'Email is not an email.');
      assert.equal(errorArray[0].path, 'email3');
    });
  });

  describe('With valid strings', () => {
    let result;
    before(() => {
      const data = schema.validate({
        email1: 'irshad@gmail.com',
        email2: 'irshad@mail.gmail.com',
        email3: 'irshad@gmail.in',
      });
      result = data.errors;
    });

    it('Should not return error', () => {
      assert.equal(result, null);
    });
  });
});
