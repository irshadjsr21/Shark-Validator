const assert = require("assert");
const { Validator, isCustom, isString } = require("../lib");

const schema = new Validator({
  password: isString(),
  confirmPassword: isCustom({
    check: (value, { allValues }) => {
      if (value !== allValues.password) {
        return "Confirm password should be equal to password.";
      }
    },
  }),
});

/**
 * @test {isCustom}
 */
describe("17. isCustom", () => {
  describe("With invalid values", () => {
    let result;
    before(() => {
      const data = schema.validate({
        password: "123456",
        confirmPassword: "12345",
      });
      result = data.errors;
    });

    it("Should return error", () => {
      assert.equal(typeof result, "object");
      assert.notEqual(result, undefined);
    });

    it("Should return error if custom check failed", () => {
      const errorArray = result.confirmPassword;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], "object");
      assert.equal(errorArray[0].validator, "isCustom");
      assert.equal(errorArray[0].value, "12345");
      assert.equal(
        errorArray[0].error,
        "Confirm password should be equal to password.",
      );
      assert.deepEqual(errorArray[0].path, ["confirmPassword"]);
    });
  });

  describe("With valid strings", () => {
    let result;
    before(() => {
      const data = schema.validate({
        password: "123456",
        confirmPassword: "123456",
      });
      result = data.errors;
    });

    it("Should not return error", () => {
      assert.equal(result, undefined);
    });
  });
});
