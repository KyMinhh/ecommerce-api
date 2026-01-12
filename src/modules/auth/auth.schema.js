const Joi = require("joi");

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(72).required(),
    fullName: Joi.string().min(1).max(255).optional(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };
