const assert = require('assert');
const {
  Validator,
  RuleSet,
  isString,
  toLowerCase,
  isRequired,
  isEmail,
} = require('../lib');

const userSchema = new Validator(
  {
    name: RuleSet.create([new isRequired(), new isString(), new toLowerCase()]),
    email: RuleSet.create([
      new isRequired(),
      new isString(),
      new isEmail(),
      new toLowerCase(),
    ]),
  },
  { returnRuleSetEarly: true },
);

const schema = new Validator({
  users: RuleSet.arrayOfObject(userSchema, null, { min: 1, max: 3 }),
});

const plainArraySchema = new Validator({
  users: RuleSet.array(
    [new isRequired(), new isString(), new toLowerCase()],
    null,
    {
      min: 1,
      max: 3,
    },
  ),
});

/**
 * @test {isArray}
 */
describe('16. isArray', () => {
  describe('With invalid values', () => {
    describe('Should return error if not an array.', () => {
      let result1;
      let result2;
      before(() => {
        const data1 = schema.validate({
          users: 'Irshad',
        });
        result1 = data1.errors;

        const data2 = plainArraySchema.validate({
          users: 'Irshad',
        });
        result2 = data2.errors;
      });

      it('Should return error', () => {
        assert.equal(typeof result1, 'object');
        assert.notEqual(result1, null);

        assert.equal(typeof result2, 'object');
        assert.notEqual(result2, null);
      });

      it('Should return error if not an array', () => {
        let errorArray = result1.users;
        assert.equal(Array.isArray(errorArray), true);
        assert.equal(errorArray.length, 1);
        assert.equal(typeof errorArray[0], 'object');
        assert.equal(errorArray[0].validator, 'isArray');
        assert.equal(errorArray[0].value, 'Irshad');
        assert.equal(errorArray[0].path, 'users');

        errorArray = result2.users;
        assert.equal(Array.isArray(errorArray), true);
        assert.equal(errorArray.length, 1);
        assert.equal(typeof errorArray[0], 'object');
        assert.equal(errorArray[0].validator, 'isArray');
        assert.equal(errorArray[0].value, 'Irshad');
        assert.equal(errorArray[0].path, 'users');
      });
    });

    describe('Should return error if less than min elements.', () => {
      let result1;
      let result2;
      before(() => {
        const data1 = schema.validate({
          users: [],
        });
        result1 = data1.errors;

        const data2 = plainArraySchema.validate({
          users: [],
        });
        result2 = data2.errors;
      });

      it('Should return error', () => {
        assert.equal(typeof result1, 'object');
        assert.notEqual(result1, null);

        assert.equal(typeof result2, 'object');
        assert.notEqual(result2, null);
      });

      it('Should return error if less than min elements', () => {
        let errorArray = result1.users;
        assert.equal(Array.isArray(errorArray), true);
        assert.equal(errorArray.length, 1);
        assert.equal(typeof errorArray[0], 'object');
        assert.equal(errorArray[0].validator, 'isArray');
        assert.deepStrictEqual(errorArray[0].value, []);
        assert.equal(errorArray[0].path, 'users');

        errorArray = result2.users;
        assert.equal(Array.isArray(errorArray), true);
        assert.equal(errorArray.length, 1);
        assert.equal(typeof errorArray[0], 'object');
        assert.equal(errorArray[0].validator, 'isArray');
        assert.deepStrictEqual(errorArray[0].value, []);
        assert.equal(errorArray[0].path, 'users');
      });
    });

    describe('Should return error if greater than max elements.', () => {
      let result1;
      let result2;
      before(() => {
        const data1 = schema.validate({
          users: [{}, {}, {}, {}, {}],
        });
        result1 = data1.errors;

        const data2 = plainArraySchema.validate({
          users: [{}, {}, {}, {}, {}],
        });
        result2 = data2.errors;
      });

      it('Should return error', () => {
        assert.equal(typeof result1, 'object');
        assert.notEqual(result1, null);

        assert.equal(typeof result2, 'object');
        assert.notEqual(result2, null);
      });

      it('Should return error if greater than max elements', () => {
        let errorArray = result1.users;
        assert.equal(Array.isArray(errorArray), true);
        assert.equal(errorArray.length, 1);
        assert.equal(typeof errorArray[0], 'object');
        assert.equal(errorArray[0].validator, 'isArray');
        assert.deepStrictEqual(errorArray[0].value, [{}, {}, {}, {}, {}]);
        assert.equal(errorArray[0].path, 'users');

        errorArray = result2.users;
        assert.equal(Array.isArray(errorArray), true);
        assert.equal(errorArray.length, 1);
        assert.equal(typeof errorArray[0], 'object');
        assert.equal(errorArray[0].validator, 'isArray');
        assert.deepStrictEqual(errorArray[0].value, [{}, {}, {}, {}, {}]);
        assert.equal(errorArray[0].path, 'users');
      });
    });

    describe('Should return error if invalid element is present.', () => {
      let result1;
      let result2;
      before(() => {
        const data1 = schema.validate({
          users: [
            { name: 'Irshad', email: 'irshad@gmail.com' },
            { name: '', email: 'irshad@gmail.com' },
            { name: 'Irshad', email: 'gmail.com' },
          ],
        });
        result1 = data1.errors;

        const data2 = plainArraySchema.validate({
          users: ['Irshad', '', []],
        });
        result2 = data2.errors;
      });

      it('Should return error', () => {
        assert.equal(typeof result1, 'object');
        assert.notEqual(result1, null);

        assert.equal(typeof result2, 'object');
        assert.notEqual(result2, null);
      });

      it('Should return error if invalid element is present', () => {
        let errorArray = result1.users;
        assert.equal(Array.isArray(errorArray), true);
        assert.equal(errorArray.length, 2);
        assert.equal(typeof errorArray[0], 'object');
        assert.equal(typeof errorArray[1], 'object');

        assert.equal(errorArray[0].validator, 'isRequired');
        assert.equal(errorArray[0].value, '');
        assert.equal(errorArray[0].path, 'users[1].name');

        assert.equal(errorArray[1].validator, 'isEmail');
        assert.equal(errorArray[1].value, 'gmail.com');
        assert.equal(errorArray[1].path, 'users[2].email');

        errorArray = result2.users;
        assert.equal(Array.isArray(errorArray), true);
        assert.equal(errorArray.length, 2);
        assert.equal(typeof errorArray[0], 'object');
        assert.equal(typeof errorArray[1], 'object');

        assert.equal(errorArray[0].validator, 'isRequired');
        assert.equal(errorArray[0].value, '');
        assert.equal(errorArray[0].path, 'users[1]');

        assert.equal(errorArray[1].validator, 'isString');
        assert.deepEqual(errorArray[1].value, []);
        assert.equal(errorArray[1].path, 'users[2]');
      });
    });
  });

  describe('With valid values', () => {
    let errors1;
    let errors2;
    let values1;
    let values2;
    before(() => {
      const data1 = schema.validate({
        users: [
          { name: 'Irshad', email: 'irshad@gmail.com' },
          { name: 'IRSHAD', email: 'irshad@gmail.com' },
          { name: 'ANSari', email: 'IRShad@gmail.com' },
        ],
      });
      errors1 = data1.errors;
      values1 = data1.values;

      const data2 = plainArraySchema.validate({
        users: ['Irshad', 'IRshad', 'Ansari'],
      });
      errors2 = data2.errors;
      values2 = data2.values;
    });

    it('Should not return error', () => {
      assert.equal(typeof errors1, 'object');
      assert.equal(errors1, null);

      assert.equal(typeof errors2, 'object');
      assert.equal(errors2, null);
    });

    it('Should transform nested keys', () => {
      assert.equal(typeof values1, 'object');
      let value = values1.users[0].name;
      assert.equal(typeof value, 'string');
      assert.equal(value, 'irshad');

      value = values1.users[1].name;
      assert.equal(typeof value, 'string');
      assert.equal(value, 'irshad');

      value = values1.users[2].name;
      assert.equal(typeof value, 'string');
      assert.equal(value, 'ansari');

      value = values1.users[2].email;
      assert.equal(typeof value, 'string');
      assert.equal(value, 'irshad@gmail.com');

      assert.equal(typeof values2, 'object');
      const [elem1, elem2, elem3] = values2.users;
      assert.equal(typeof elem1, 'string');
      assert.equal(elem1, 'irshad');

      assert.equal(typeof elem2, 'string');
      assert.equal(elem2, 'irshad');

      assert.equal(typeof elem3, 'string');
      assert.equal(elem3, 'ansari');
    });
  });
});
