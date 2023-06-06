const Joi = require("joi");
const confirmPasswordSchema = Joi.object({

    newpassword: Joi.string().required().min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
    .message(
      'New Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
    ),
    confirmPassword: Joi.string().required().min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
    .message(
      'Confirm Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
    )
   
});
exports.confirmPasswordSchema = confirmPasswordSchema;
