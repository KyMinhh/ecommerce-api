const Joi = require('joi');

const updateOrderStatusSchema = Joi.object({
    status: Joi.string().valid('pending', 'shipped', 'delivered', 'cancelled', 'paid').required(),
})

module.exports = { updateOrderStatusSchema };