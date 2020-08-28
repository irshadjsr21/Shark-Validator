const assert = require("assert");
const { Validator, isLen } = require("../lib");

const schema = new Validator({
  name: isLen({ eq: 5 }),
  yearOfBirth: isLen({ eq: 4 }),
  username: isLen({ min: 3 }),
  email: isLen({ max: 10 }),
  password: isLen({ min: 8, max: 10 }),
  confirmPassword: isLen({ min: 8, max: 10 }),
  gender: {
    rules: [
      isLen({ eq: 1, message: "%name% should only have %eq% charecter." }),
    ],
    label: "Gender",
  },
});

/**
 * @test {isLen}
 */
describe("03. isLen", () => {
  describe("With error values", () => {
    let result;
    before(() => {
      const data = schema.validate({
        name: "irsh",
        yearOfBirth: "20181",
        username: "ir",
        email: "irshad@gmail.com",
        password: "1234567",
        confirmPassword: "12345678910",
        gender: "MALE",
      });
      result = data.errors;
    });

    it("Should return error", () => {
      assert.equal(typeof result, "object");
      assert.notEqual(result, null);
    });

    it("Should return error if less than `eq`", () => {
      const errorArray = result.name;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], "object");
      assert.equal(errorArray[0].validator, "isLen");
      assert.equal(errorArray[0].value, "irsh");
      assert.deepEqual(errorArray[0].path, ["name"]);
    });

    it("Should return error if greater than `eq`", () => {
      const errorArray = result.yearOfBirth;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], "object");
      assert.equal(errorArray[0].validator, "isLen");
      assert.equal(errorArray[0].value, "20181");
      assert.deepEqual(errorArray[0].path, ["yearOfBirth"]);
    });

    it("Should return error if less than `min`", () => {
      const errorArray = result.username;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], "object");
      assert.equal(errorArray[0].validator, "isLen");
      assert.equal(errorArray[0].value, "ir");
      assert.deepEqual(errorArray[0].path, ["username"]);
    });

    it("Should return error if greater than `max`", () => {
      const errorArray = result.email;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], "object");
      assert.equal(errorArray[0].validator, "isLen");
      assert.equal(errorArray[0].value, "irshad@gmail.com");
      assert.deepEqual(errorArray[0].path, ["email"]);
    });

    it("Should return error if less than `min` when both `min` & `max` are present", () => {
      const errorArray = result.password;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], "object");
      assert.equal(errorArray[0].validator, "isLen");
      assert.equal(errorArray[0].value, "1234567");
      assert.deepEqual(errorArray[0].path, ["password"]);
    });

    it("Should return error if greater than `max` when both `min` & `max` are present", () => {
      const errorArray = result.confirmPassword;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], "object");
      assert.equal(errorArray[0].validator, "isLen");
      assert.equal(errorArray[0].value, "12345678910");
      assert.deepEqual(errorArray[0].path, ["confirmPassword"]);
    });

    it("Should return custom message on error", () => {
      const errorArray = result.gender;
      assert.equal(Array.isArray(errorArray), true);
      assert.equal(errorArray.length, 1);
      assert.equal(typeof errorArray[0], "object");
      assert.equal(errorArray[0].validator, "isLen");
      assert.equal(errorArray[0].value, "MALE");
      assert.equal(errorArray[0].error, "Gender should only have 1 charecter.");
      assert.deepEqual(errorArray[0].path, ["gender"]);
    });
  });

  describe("With valid values", () => {
    let result;
    before(() => {
      const data = schema.validate({
        name: "irsha",
        yearOfBirth: "2018",
        username: "irs",
        email: "irs@mil.in",
        password: "12345678",
        confirmPassword: "123456789",
        gender: "M",
      });
      result = data.errors;
    });

    it("Should not return error", () => {
      assert.equal(result, undefined);
    });
  });
});
