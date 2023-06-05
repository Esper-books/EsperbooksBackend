var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var userValidate = require("../validation/userValidate");
var userRepository = require("../repo/userRepo");
var companyRepository = require("../repo/companyRepo");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const secretKey = "secret esperbook";
var mailingService = require("../service/mailing_service");
var util = require("../utils/util");
var resetpasswordRepo = require("../repo/resetPasswordTokenRepo");
const { error } = require("console");
const { encode } = require("querystring");

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

  reqBody.password = encrypt(reqBody.password, secretKey);
  companyRepository.fetchCompanyByToken(companyToken, (presp) => {
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
    userRepository
      .createUser(reqBody2)
      .then((presp) => {
        mailingService.sendCreateMailNotification(presp);
        return res.status(200).json({
          responseCode: 200,
          responseMessage: "User Created Successfully!",
        });
      })
      .catch((error) => {
        if (error.name === "SequelizeUniqueConstraintError") {
          // Handle the duplicate error
          const value = error.errors[0].value;
          if (error)
            return res
              .status(400)
              .json({ responseMessage: `${value} already exist.` });
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

router.post("/send/resetpassword/link", (req, res) => {
  userReq = req.body;

  const token = jwt.sign({ email: userReq.email }, secretKey, {
    expiresIn: "1h",
  });

  const reqbody = { email: userReq.email, token: token };

  userRepository.fetchUserByEmail(reqbody.email , ((data) => {
    if (data == null) {
      return res.status(404).json({
        responseCode: 404,
        responseMessage: "User does not exist",
      });
    }
    resetpasswordRepo
    .createResetPassword(reqbody)
    .then((presp) => {
      mailingService.sendResetPasswordNotification(reqbody);
      return res.status(200).json({
        responseCode: 200,
        responseMessage: "Reset link has been sent to email if it exist.",
      });
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(500)
        .json({ responseCode: 500, responseMessage: "Server Error" });
    });
  }
  )).catch(error => {
    console.log(error);
  });
});

router.post("/resetpassword", (req, res) => {
  reqBody = req.body;
  const { token } = req.query;

  resetpasswordRepo
    .fetchResetPByToken(token, (presp) => {
      if (presp == null)
        if (isTokenExpired(token)) {
          return res
            .status(400)
            .json({ responseCode: 400, responseMessage: "Token has expired" });
        }

      reqBody.newpassword = encrypt(reqBody.newpassword, secretKey);
      userRepository
        .updatePassword({
          email: presp.email,
          newpassword: reqBody.newpassword,
        })
        .then((data) => {
          if (data == undefined) {
            return res.status(500).json({
              responseCode: 500,
              responseMessage: "Failed",
            });
          }
          return res.status(200).json({
            responseCode: 200,
            responseMessage: "Password Changed Successfully!",
          });
        })
        .catch((error) => {
          return res.status(500).json({
            responseCode: 500,
            responseMessage: "Failed",
          });
        });
    })
    .catch((error) => {
      console.log(error);
      console.error(error);
      return res
        .status(500)
        .json({ responseCode: 500, responseMessage: "Server Error" });
    });
});

function requestObject(
  firstName,
  lastName,
  dateOfBirth,
  phoneNumber,
  gender,
  country,
  emailAddress,
  password,
  confirmPassword,
  companyToken
) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.dateOfBirth = dateOfBirth;
  this.phoneNumber = phoneNumber;
  this.gender = gender;
  this.country = country;
  this.emailAddress = emailAddress;
  this.password = password;
  this.confirmPassword = confirmPassword;
  this.companyToken = companyToken;
}

function encrypt(text, password) {
  const cipher = crypto.createCipher("aes-256-cbc", password);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function isTokenExpired(token) {
  try {
    const decodedToken = jwt.verify(token, secretKey);
    const currentTime = Date.now() / 1000; // Convert to seconds
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error("Error verifying token:", error);
    return true; // Consider token as expired in case of error
  }
}

module.exports = router;
