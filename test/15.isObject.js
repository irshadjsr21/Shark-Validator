const assert = require('assert');
const util = require('util');
const {
  Validator,
  RuleSet,
  isString,
  isObject,
  toLowerCase,
  toInt
} = require('../lib');

const addressSchema = new Validator({
  city: RuleSet.create([new toInt()]),
});

const userSchema = new Validator(
  {
    name: RuleSet.create([new isString(), new toLowerCase()]),
    address: RuleSet.create([new isObject({ schema: addressSchema })]),
  },
  { showNestedError: false },
);

const schema = new Validator({
  user1: RuleSet.create([new isObject({ schema: userSchema })]),
});

/**
 * @test {isObject}
 */
describe('15. isObject', () => {
  describe('With invalid values', () => {
    let result;
    before(() => {
      const data = schema.validate({
        user1: { name: 'IRSHAD', address: { city: '100' } },
      });
      result = data.errors;
      console.log(util.inspect(result, { depth: null }));
      console.log(data.values);
    });

    it('Should return error', () => {
      assert.equal(typeof result, 'object');
      assert.notEqual(result, null);
    });

    // it('Should return error if only user name', () => {
    //   const errorArray = result.email1;
    //   assert.equal(Array.isArray(errorArray), true);
    //   assert.equal(errorArray.length, 1);
    //   assert.equal(typeof errorArray[0], 'object');
    //   assert.equal(errorArray[0].validator, 'isEmail');
    //   assert.equal(errorArray[0].value, 'irshad');
    // });

    // it('Should return error if only user name with @', () => {
    //   const errorArray = result.email2;
    //   assert.equal(Array.isArray(errorArray), true);
    //   assert.equal(errorArray.length, 1);
    //   assert.equal(typeof errorArray[0], 'object');
    //   assert.equal(errorArray[0].validator, 'isEmail');
    //   assert.equal(errorArray[0].value, 'irshad@');
    // });

    // it('Should return error if top level domain is missing', () => {
    //   const errorArray = result.email3;
    //   assert.equal(Array.isArray(errorArray), true);
    //   assert.equal(errorArray.length, 1);
    //   assert.equal(typeof errorArray[0], 'object');
    //   assert.equal(errorArray[0].validator, 'isEmail');
    //   assert.equal(errorArray[0].value, 'irshad@gmail');
    // });

    // it('Should return custom message on error', () => {
    //   const errorArray = result.email3;
    //   assert.equal(Array.isArray(errorArray), true);
    //   assert.equal(errorArray.length, 1);
    //   assert.equal(typeof errorArray[0], 'object');
    //   assert.equal(errorArray[0].validator, 'isEmail');
    //   assert.equal(
    //     errorArray[0].error,
    //     'Email is not an email.',
    //   );
    // });
  });

  // describe('With valid strings', () => {
  //   let result;
  //   before(() => {
  //     const data = schema.validate({
  //       email1: 'irshad@gmail.com',
  //       email2: 'irshad@mail.gmail.com',
  //       email3: 'irshad@gmail.in',
  //     });
  //     result = data.errors;
  //   });

  //   it('Should not return error', () => {
  //     assert.equal(result, null);
  //   });
  // });
});
