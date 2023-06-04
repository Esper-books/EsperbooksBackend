//"use strict";
const Joi = require("joi");
const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    dateOfBirth: Joi.string().required(),
    gender: Joi.string().required(),
    country: Joi.string().required(),
    emailAddress: Joi.string().required(),
    phoneNumber: Joi.string(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
    companyToken: Joi.string()
});
exports.userSchema = userSchema;



  

