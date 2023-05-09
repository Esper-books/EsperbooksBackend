//"use strict";
const Joi = require("joi");
const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    dateOfBirth: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required()
});
exports.companySchema = companySchema;
  

