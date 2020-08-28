import Joi from "joi";

const userSchema = Joi.object().keys({
  name: Joi.string().lowercase().required(),
  email: Joi.string()
    .lowercase()
    .email({ tlds: { allow: false } })
    .required(),
});

const schema = Joi.object().keys({
  users: Joi.array().items(userSchema).max(3).min(1),
});

const test = schema.validate({ users: [{ name: "hello" }, { email: "hi" }] });

console.log(test);
