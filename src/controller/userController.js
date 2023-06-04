var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var userValidate = require("../validation/userValidate");
var userRepository = require("../repo/userRepo");
var companyRepository = require("../repo/companyRepo");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const secretKey = "secret esperbook";
var mailingService = require('../service/mailing_service')

var reqBody;

router.post("", (req, res) => {
  reqBody = req.body;

  const { companyToken } = req.query;
  const { error } = userValidate.userSchema.validate(reqBody);
  if (error) return res.status(400).json(error.details);

  if (reqBody.password != reqBody.confirmPassword) {
    return res.status(400).json({
      responseCode: 400,
      responseMessage: "Password not the same",
    });
  }

  reqBody.password  = encryptPassword(reqBody.password, salt);
  companyRepository
    .fetchCompanyByToken(companyToken, (presp) => {
      if (presp == null) {
        return res.status(404).json({
          responseCode: 404,
          responseMessage: "Token does not exist!",
        });
      }

      const reqBody2 = new requestObject(
        reqBody.firstName,
        reqBody.lastName,
        reqBody.dateOfBirth,
        reqBody.phoneNumber,
        reqBody.gender,
        reqBody.country,
        reqBody.emailAddress,
        reqBody.password,
        reqBody.confirmPassword,
        presp.companyToken
      );
      userRepository.createUser(reqBody2)
      .then(
        (presp) => {
          mailingService.sendCreateMailNotification(presp);
          return res
            .status(200)
            .json({
              responseCode: 200,
              responseMessage: "User Created Successfully!",
            });
        }) .catch((error) => {
          if (error.name === 'SequelizeUniqueConstraintError') {
            // Handle the duplicate error
            const value = error.errors[0].value;
            if (error) return res.status(400).json(    
              {responseMessage:`${value} already exist.`});
          } else {
            // Handle other errors
             console.error(error);
          }
          return res
            .status(500)
            .json({ responseCode: 500, responseMessage: "Server Error" });
    });
});

});

function requestObject( firstName       
  ,lastName        
  ,dateOfBirth     
  ,phoneNumber     
  ,gender          
  ,country         
  ,emailAddress     
  ,password        
  ,confirmPassword 
,companyToken){
this.firstName        = firstName;
this.lastName         = lastName   ;
this.dateOfBirth      = dateOfBirth;
this.phoneNumber      = phoneNumber;
this.gender           = gender     ;
this.country          = country    ;
this.emailAddress      = emailAddress;
this.password         = password   ;
this.confirmPassword  = confirmPassword;
this.companyToken  = companyToken  ;
}

module.exports = router;
