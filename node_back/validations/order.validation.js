const Joi = require('joi');
const userValid =  Joi.object(
    {
        user_id: Joi.number(),
        product_id: Joi.number().required(),
        product_quantity: Joi.number().required(),
        total_price: Joi.number(),
    });

module.exports = userValid;