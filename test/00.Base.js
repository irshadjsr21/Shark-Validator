const assert = require("assert");
const {
  isRequired,
  isString,
  isLen,
  isAlphaNum,
  Validator,
} = require("../lib");

/**
 * @test {Validator}
 * @test {RuleSet}
 */
describe("00. Base for all Rules", () => {
  describe("With returnEarly: true", () => {
    let result;
    before(() => {
      const schema = new Validator(
        {
          name: [isString(), isRequired()],
          username: [isString(), isLen({ min: 2 }), isAlphaNum(), isRequired()],
        },
        { returnEarly: true },
      );
      const data = schema.validate({
        name: null,
        username: "#",
      });
      result = data.errors;
    });

    it("Should return error", () => {
      assert.equal(typeof result, "object");
      assert.notEqual(result, undefined);
    });

    it("Should return error on null", () => {
      const errorArray = result.name;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], "object");
      assert.equal(errorArray[0].validator, "isRequired");
      assert.equal(errorArray[0].value, null);
      assert.deepEqual(errorArray[0].path, ["name"]);
    });

    it("Should not return error on invalid string", () => {
      const errorArray = result.username;
      assert.equal(errorArray, undefined);
    });
  });

  describe("With returnEarly: false", () => {
    let result;
    before(() => {
      const schema = new Validator(
        {
          name: [isString(), isRequired()],
          username: [isString(), isLen({ min: 2 }), isAlphaNum(), isRequired()],
        },
        { returnEarly: false },
      );

      const data = schema.validate({
        name: null,
        username: "#",
      });
      result = data.errors;
    });

    it("Should return error", () => {
      assert.equal(typeof result, "object");
      assert.notEqual(result, undefined);
    });

    it("Should return error on null", () => {
      const errorArray = result.name;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], "object");
      assert.equal(errorArray[0].validator, "isRequired");
      assert.equal(errorArray[0].value, null);
      assert.deepEqual(errorArray[0].path, ["name"]);
    });

    it("Should return error on invalid string", () => {
      const errorArray = result.username;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 2);
      assert.equal(typeof errorArray[0], "object");
      assert.equal(errorArray[0].validator, "isLen");
      assert.equal(errorArray[0].value, "#");
      assert.deepEqual(errorArray[0].path, ["username"]);

      assert.equal(typeof errorArray[1], "object");
      assert.equal(errorArray[1].validator, "isAlphaNum");
      assert.equal(errorArray[1].value, "#");
      assert.deepEqual(errorArray[1].path, ["username"]);
    });
  });

  describe("With returnEarly: true & returnRuleSetEarly: true", () => {
    let result;
    before(() => {
      const schema = new Validator(
        {
          name: [isString(), isRequired()],
          username: [isString(), isLen({ min: 2 }), isAlphaNum(), isRequired()],
        },
        { returnEarly: true, returnRuleSetEarly: true },
      );

      const data = schema.validate({
        name: null,
        username: "#",
      });
      result = data.errors;
    });

    it("Should return error", () => {
      assert.equal(typeof result, "object");
      assert.notEqual(result, undefined);
    });

    it("Should return error on null", () => {
      const errorArray = result.name;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], "object");
      assert.equal(errorArray[0].validator, "isRequired");
      assert.equal(errorArray[0].value, null);
      assert.deepEqual(errorArray[0].path, ["name"]);
    });

    it("Should not return error on invalid string", () => {
      const errorArray = result.username;
      assert.equal(errorArray, undefined);
    });
  });

  describe("With returnEarly: false & returnRuleSetEarly: true", () => {
    let result;
    before(() => {
      const schema = new Validator(
        {
          name: [isString(), isRequired()],
          username: [isString(), isLen({ min: 2 }), isAlphaNum(), isRequired()],
        },
        { returnEarly: false, returnRuleSetEarly: true },
      );

      const data = schema.validate({
        name: null,
        username: "#",
      });
      result = data.errors;
    });

    it("Should return error", () => {
      assert.equal(typeof result, "object");
      assert.notEqual(result, null);
    });

    it("Should return error on null", () => {
      const errorArray = result.name;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], "object");
      assert.equal(errorArray[0].validator, "isRequired");
      assert.equal(errorArray[0].value, null);
      assert.deepEqual(errorArray[0].path, ["name"]);
    });

    it("Should return error on invalid string", () => {
      const errorArray = result.username;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], "object");
      assert.equal(errorArray[0].validator, "isLen");
      assert.equal(errorArray[0].value, "#");
      assert.deepEqual(errorArray[0].path, ["username"]);
    });
  });
});
