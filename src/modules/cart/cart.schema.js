const Joi = require('joi');

const upsertCartItemSchema = Joi.object({
    productId: Joi.number().integer().positive().required(),
    quantity: Joi.number().integer().min(1).max(999).positive().required(),
});

module.exports = {
    upsertCartItemSchema,
};