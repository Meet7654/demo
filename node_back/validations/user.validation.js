const Joi = require('joi');
const userValid =  Joi.object(
    { first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        role: Joi.string()
    });

module.exports = userValid;