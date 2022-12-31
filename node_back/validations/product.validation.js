const Joi = require('joi');
const productValid =  Joi.object(
    { name: Joi.string().required(),
        image: Joi.string(),
        price: Joi.number().required(),
        quantity: Joi.string().required(),
    });

module.exports = productValid;