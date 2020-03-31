const assert = require('assert');
const { Validator, RuleSet, toUpperCase } = require('../lib');

const schema = new Validator({
  email: RuleSet.create([new toUpperCase()]),
  password: RuleSet.create([new toUpperCase()]),
});

/**
 * @test {toUpperCase}
 */
describe('13. toUpperCase', () => {
  let values, errors;
  before(() => {
    const data = schema.validate({
      email: 'Irshad@GMAIL.com',
      password: 'Irshad Ansari',
    });
    values = data.values;
    errors = data.errors;
  });

  it('Should not return error', () => {
    assert.equal(errors, null);
  });

  it('Should return upper case with symbols', () => {
    assert.equal(typeof values, 'object');
    const value = values.email;
    assert.equal(typeof value, 'string');
    assert.equal(value, 'IRSHAD@GMAIL.COM');
  });

  it('Should return upper case with spaces', () => {
    assert.equal(typeof values, 'object');
    const value = values.password;
    assert.equal(typeof value, 'string');
    assert.equal(value, 'IRSHAD ANSARI');
  });
});
