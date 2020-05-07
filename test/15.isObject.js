const assert = require('assert');
const { Validator, RuleSet, isString, toLowerCase } = require('../lib');

const addressSchema = new Validator({
  city: RuleSet.create([new isString(), new toLowerCase()]),
});

const userSchema = new Validator({
  name: RuleSet.create([new isString(), new toLowerCase()]),
  address: RuleSet.object(addressSchema, 'Address', {
    message: '%name% must be an object.',
  }),
});

const schema = new Validator({
  user: RuleSet.object(userSchema),
});

/**
 * @test {isObject}
 */
describe('15. isObject', () => {
  describe('With invalid values', () => {
    describe('Should return error if not an object.', () => {
      let result;
      before(() => {
        const data = schema.validate({
          user: 'Irshad',
        });
        result = data.errors;
      });

      it('Should return error', () => {
        assert.equal(typeof result, 'object');
        assert.notEqual(result, null);
      });

      it('Should return error of not an object', () => {
        const errorArray = result.user;
        assert.equal(Array.isArray(errorArray), true);
        assert.equal(errorArray.length, 1);
        assert.equal(typeof errorArray[0], 'object');
        assert.equal(errorArray[0].validator, 'isObject');
        assert.equal(errorArray[0].value, 'Irshad');
        assert.equal(errorArray[0].path, 'user');
      });
    });

    describe('Should return error if key is not present.', () => {
      let result;
      before(() => {
        const data = schema.validate({
          user: {},
        });
        result = data.errors;
      });

      it('Should return error', () => {
        assert.equal(typeof result, 'object');
        assert.notEqual(result, null);
      });

      it('Should return error if name is not present', () => {
        const errorArray = result.user;
        assert.equal(Array.isArray(errorArray), true);
        assert.equal(errorArray.length, 2);
        assert.equal(typeof errorArray[0], 'object');
        assert.equal(typeof errorArray[1], 'object');

        assert.equal(errorArray[0].validator, 'isString');
        assert.equal(errorArray[0].value, undefined);
        assert.equal(errorArray[0].path, 'user.name');

        assert.equal(errorArray[1].validator, 'isObject');
        assert.equal(errorArray[1].value, undefined);
        assert.equal(errorArray[1].path, 'user.address');
      });
    });

    describe('Should return error if object key is invalid.', () => {
      let result;
      before(() => {
        const data = schema.validate({
          user: { name: 21, address: 1 },
        });
        result = data.errors;
      });

      it('Should return error', () => {
        assert.equal(typeof result, 'object');
        assert.notEqual(result, null);
      });

      it('Should return error if object key is invalid', () => {
        const errorArray = result.user;
        assert.equal(Array.isArray(errorArray), true);
        assert.equal(errorArray.length, 2);
        assert.equal(typeof errorArray[0], 'object');
        assert.equal(typeof errorArray[1], 'object');

        assert.equal(errorArray[0].validator, 'isString');
        assert.equal(errorArray[0].value, 21);
        assert.equal(errorArray[0].path, 'user.name');

        assert.equal(errorArray[1].validator, 'isObject');
        assert.equal(errorArray[1].value, 1);
        assert.equal(errorArray[1].path, 'user.address');
      });

      it('Should return custom message', () => {
        const errorArray = result.user;
        assert.equal(errorArray[1].error, 'Address must be an object.');
      });
    });

    describe('Should return error if multi-nested object key is invalid.', () => {
      let result;
      before(() => {
        const data = schema.validate({
          user: { name: 'Irshad', address: { city: 2 } },
        });
        result = data.errors;
      });

      it('Should return error', () => {
        assert.equal(typeof result, 'object');
        assert.notEqual(result, null);
      });

      it('Should return error if multi-nested object key is invalid', () => {
        const errorArray = result.user;
        assert.equal(Array.isArray(errorArray), true);
        assert.equal(errorArray.length, 1);
        assert.equal(typeof errorArray[0], 'object');
        assert.equal(errorArray[0].validator, 'isString');
        assert.equal(errorArray[0].value, 2);
        assert.equal(errorArray[0].path, 'user.address.city');
      });
    });
  });

  describe('With valid values', () => {
    let errors, values;
    before(() => {
      const data = schema.validate({
        user: { name: 'IRSHAD', address: { city: 'Bangalore' } },
      });
      errors = data.errors;
      values = data.values;
    });

    it('Should not return error', () => {
      assert.equal(typeof errors, 'object');
      assert.equal(errors, null);
    });

    it('Should transform nested keys', () => {
      assert.equal(typeof values, 'object');
      let value = values.user.name;
      assert.equal(typeof value, 'string');
      assert.equal(value, 'irshad');

      value = values.user.address.city;
      assert.equal(typeof values, 'object');
      assert.equal(typeof value, 'string');
      assert.equal(value, 'bangalore');
    });
  });
});
