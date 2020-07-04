const assert = require('assert');
const { Validator, toLowerCase } = require('../lib');

const schema = new Validator({
  email: toLowerCase(),
  password: toLowerCase(),
});

/**
 * @test {toLowerCase}
 */
describe('12. toLowerCase', () => {
  let values;
  let errors;
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

  it('Should return lower case with symbols', () => {
    assert.equal(typeof values, 'object');
    const value = values.email;
    assert.equal(typeof value, 'string');
    assert.equal(value, 'irshad@gmail.com');
  });

  it('Should return lower case with spaces', () => {
    assert.equal(typeof values, 'object');
    const value = values.password;
    assert.equal(typeof value, 'string');
    assert.equal(value, 'irshad ansari');
  });
});
