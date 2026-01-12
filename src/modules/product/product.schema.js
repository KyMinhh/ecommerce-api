const Joi = require("joi");

const createProductSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().integer().min(0).required(),
  description: Joi.string().allow("").optional(),
  isActive: Joi.boolean().optional(),
  imageUrl: Joi.string().uri().optional(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(1).max(255).optional(),
  price: Joi.number().min(0).optional(),
  stock: Joi.number().integer().min(0).optional(),
  description: Joi.string().allow("").optional(),
  isActive: Joi.boolean().optional(),
}).min(1);

module.exports = { createProductSchema, updateProductSchema };
