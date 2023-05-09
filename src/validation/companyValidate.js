//"use strict";
const Joi = require("joi");
const companySchema = Joi.object({
    contact: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    emailAddress: Joi.string().email().required().messages({
        'string.emailAddress': 'Please enter a valid email address', 
        'any.required' : 'Email is required'
    }),
    companyAddress: Joi.string().required(),
    companyBriefOverview: Joi.string().required(),
    country: Joi.string().required(),
    state: Joi.string().required(),
    name: Joi.string().required(),
    size: Joi.string().required(),
    companyType: Joi.string().valid('GROUP', 'INDIVIDUAL').required(),
    companyToken: Joi.string()
});
exports.companySchema = companySchema;
  

