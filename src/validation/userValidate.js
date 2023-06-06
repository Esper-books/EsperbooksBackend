
const Joi = require("joi");
const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    dateOfBirth: Joi.string().required(),
    gender: Joi.string().valid('MALE', 'FEMALE').required(),
    country: Joi.string().required(),
    emailAddress: Joi.string().required().email().required().messages({
        'string.emailAddress': 'Please enter a valid email address', 
        'any.required' : 'Email is required'
    }),
    phoneNumber: Joi.string(),
    password: Joi.string().required().min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
    .message(
      'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
    ),
    confirmPassword: Joi.string().required(),
    companyToken: Joi.string()
});
exports.userSchema = userSchema;



  

