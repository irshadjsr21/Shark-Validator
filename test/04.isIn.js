const assert = require('assert');
const { Validator, isIn } = require('../lib');

const schema = new Validator({
  name: isIn({ in: ['irshad', 'ansari'] }),
  yearOfBirth: isIn({ in: [2018, 2019] }),
  username: isIn({ in: ['irshad'] }),
  gender: {
    rules: [isIn({ in: ['M', 'F'], message: '%name% can only be %in%.' })],
    label: 'Gender',
  },
});

/**
 * @test {isIn}
 */
describe('04. isIn', () => {
  describe('With error values', () => {
    let result;
    before(() => {
      const data = schema.validate({
        name: 'irsh',
        yearOfBirth: '20181',
        username: 'ir',
        gender: 'MALE',
      });
      result = data.errors;
    });

    it('Should return error', () => {
      assert.equal(typeof result, 'object');
      assert.notEqual(result, null);
    });

    it('Should return error if not in given strings', () => {
      const errorArray = result.name;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isIn');
      assert.equal(errorArray[0].value, 'irsh');
      assert.equal(errorArray[0].path, 'name');
    });

    it('Should return error if not in given numbers', () => {
      const errorArray = result.yearOfBirth;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isIn');
      assert.equal(errorArray[0].value, '20181');
      assert.equal(errorArray[0].path, 'yearOfBirth');
    });

    it('Should return error if not in given single string', () => {
      const errorArray = result.username;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isIn');
      assert.equal(errorArray[0].value, 'ir');
      assert.equal(errorArray[0].path, 'username');
    });

    it('Should return custom message on error', () => {
      const errorArray = result.gender;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], 'object');
      assert.equal(errorArray[0].validator, 'isIn');
      assert.equal(errorArray[0].value, 'MALE');
      assert.equal(errorArray[0].error, 'Gender can only be M, F.');
      assert.equal(errorArray[0].path, 'gender');
    });
  });

  describe('With valid values', () => {
    let result;
    before(() => {
      const data = schema.validate({
        name: 'irshad',
        yearOfBirth: 2018,
        username: 'irshad',
        gender: 'M',
      });
      result = data.errors;
    });

    it('Should not return error', () => {
      assert.equal(result, null);
    });
  });
});
