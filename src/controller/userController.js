var express = require("express");
var router = express.Router();
var userValidate = require("../validation/userValidate");
var userRepository = require("../repo/userRepo");
var companyRepository = require("../repo/companyRepo");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const secretKey = "secret esperbook";
var mailingService = require("../service/mailing_service");
var resetpasswordRepo = require("../repo/resetPasswordTokenRepo");
var passwordValidate = require("../validation/passwordResetValidate");
var sf = require("../service/security");
var roleRepository = require("../repo/roleRepo");




var reqBody;

router.post("",sf.processOnboardingUserRole,async (sreq, res) => {
  reqBody = sreq.body;
  const { error } = userValidate.userSchema.validate(reqBody);
  if (error) return res.status(400).json(error.details);

  if (reqBody.password != reqBody.confirmPassword) {
    return res.status(400).json({
      responseCode: 400,
      responseMessage: "Password not the same",
    });
  }

  reqBody.password = encrypt(reqBody.password, secretKey);
  companyRepository.fetchCompanyByToken(sreq.sDetail.companyToken, (presp) => {
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
      presp.companyToken,
      presp.id,
      sreq.sDetail.roleName
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

  userRepository
    .fetchUserByEmail(reqbody.email, (data) => {
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
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/resetpassword", (req, res) => {
  reqBody = req.body;
  const { token } = req.query;

  const { error } = passwordValidate.confirmPasswordSchema.validate(reqBody);
  if (error) return res.status(400).json(error.details);

  if (reqBody.newpassword !== reqBody.confirmPassword) return res
  .status(400)
  .json({ responseCode: 400, responseMessage: "Password and confirm password are not equal" });

  if (isTokenExpired(token)) {
    resetpasswordRepo.removeUsedToken(token);
    return res
      .status(400)
      .json({ responseCode: 400, responseMessage: "Token has expired" });
  }

  resetpasswordRepo.fetchResetPByToken(token, (presp) => {
    if (presp == null) {
      return res
        .status(400)
        .json({ responseCode: 400, responseMessage: "Invalid Token" });
    }

    reqBody.newpassword = encrypt(reqBody.newpassword, secretKey);
    userRepository.updatePassword({
      email: presp.email,
      newpassword: reqBody.newpassword,
    });

    resetpasswordRepo.removeUsedTokenWithEmail(presp.email);
    
    return res.status(200).json({
      responseCode: 200,
      responseMessage: "Password Changed Successfully!",
    });
  });
});

router.get("/personnel", sf.authenticateToken,sf.authorizeRoles('CAN_GET_COMPANY'), async (sreq, res) => {
  userRepository.fetchUserById(sreq.user.id, (fubir) =>{
      if (fubir !=null){
        userRepository.fetchCompanyEmailsByCompanyId(fubir.companyId, (data) => {
          console.log(data);
          return res.status(200).json({ responseCode: 200, responseBody: data });
        });
      }
  }  );

});



router.get("/personnelDetails", sf.authenticateToken,sf.authorizeRoles('CAN_GET_COMPANY'), async (sreq, res) => {
  const { email} = sreq.query;
  userRepository.fetchUserById(sreq.user.id, (fubir) =>{
      if (fubir !=null){
        userRepository.fetchUserByCompanyIdEmail({companyId:fubir.companyId , email: email}, (data) => {
          data.password = null ;
          data.companyId = null ; 
          data.companyToken = null ; 
          data.id = null ; 
          return res.status(200).json({ responseCode: 200, responseBody: data });
        });
      }
  }  );

});


router.get("/personnel/manager", sf.authenticateToken,sf.authorizeRoles('CAN_GET_COMPANY'), async (sreq, res) => {
  userRepository.fetchUserById(sreq.user.id, (fubir) =>{
    if (fubir !=null){
      userRepository.fetchCompanyEmailsByCompanyIdByManagerStatic(fubir.companyId, (data) => {
        console.log(data);
        return res.status(200).json({ responseCode: 200, responseBody: data });
      });
    }
}  );

});

router.put("/personnelDetails", sf.authenticateToken,sf.authorizeRoles('CAN_GET_COMPANY'), async (sreq, res) => {
  const { email} = sreq.query;
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    phoneNumber,
    country,
    isManager,
    isActive,
    bioDataStatus,
    hmnEnrollmentStatus,
    inductionCompletedStatus,
    gurantorChecksStatus,
    workStationStatus,
    licencePermitStatus,
    workIdCardStatus,
    softwareAccessStatus,
    maritalStatus,
    department,
    jobTitle,
    anualLeave,
    compassionateLeave,
    paternityLeave,
    maternityLeave,
    sickLeave,
    leaveWithoutPay,
    backUps
} = sreq.body;
  userRepository.fetchUserById(sreq.user.id, (fubir) =>{
      if (fubir !=null){
        userRepository.fetchUserByCompanyIdEmail({companyId:fubir.companyId , email: email}, (record) => {
          record = record.dataValues;
          if (firstName) {
            record.firstName = firstName;
          }
          
          if (lastName) {
            record.lastName = lastName;
          }
          
          if (dateOfBirth) {
            record.dateOfBirth = dateOfBirth;
          }
          
          if (gender) {
            record.gender = gender;
          }
          
          if (phoneNumber) {
            record.phoneNumber = phoneNumber;
          }
          
          if (country) {
            record.country = country;
          }
          
          
          if (isManager != null) {
            record.isManager = isManager;
          }
      
          if (isActive != null) {
            record.isActive = isActive;
          }
          
          if (bioDataStatus !== undefined && bioDataStatus !== null) {
            record.bioDataStatus = bioDataStatus;
          }
          
          if (hmnEnrollmentStatus !== undefined && hmnEnrollmentStatus !== null) {
            record.hmnEnrollmentStatus = hmnEnrollmentStatus;
          }
          
          if (inductionCompletedStatus !== undefined && inductionCompletedStatus !== null) {
            record.inductionCompletedStatus = inductionCompletedStatus;
          }
          
          if (gurantorChecksStatus !== undefined && gurantorChecksStatus !== null) {
            record.gurantorChecksStatus = gurantorChecksStatus;
          }
          
          if (workStationStatus !== undefined && workStationStatus !== null) {
            record.workStationStatus = workStationStatus;
          }
          
          if (licencePermitStatus !== undefined && licencePermitStatus !== null) {
            record.licencePermitStatus = licencePermitStatus;
          }
          
          if (workIdCardStatus !== undefined && workIdCardStatus !== null) {
            record.workIdCardStatus = workIdCardStatus;
          }
          
          if (softwareAccessStatus !== undefined && softwareAccessStatus !== null) {
            record.softwareAccessStatus = softwareAccessStatus;
          }
          
          if (maritalStatus) {
            record.maritalStatus = maritalStatus;
          }
          
          if (department) {
            record.department = department;
          }
          
          if (jobTitle) {
            record.jobTitle = jobTitle;
          }
          
          if (anualLeave) {
            record.anualLeave = anualLeave;
          }
          
          if (compassionateLeave) {
            record.compassionateLeave = compassionateLeave;
          }
          
          if (paternityLeave) {
            record.paternityLeave = paternityLeave;
          }
          
          if (maternityLeave) {
            record.maternityLeave = maternityLeave;
          }
          
          if (sickLeave) {
            record.sickLeave = sickLeave;
          }
          
          if (leaveWithoutPay) {
            record.leaveWithoutPay = leaveWithoutPay;
          }
          
          if (backUps) {
            record.backUps = backUps;
          }
          userRepository.updateUserByAdmin(record,(uubar) =>{
            if (uubar == null){
              return res.status(500).json({ responseCode: 200, responseBody: null });
            }
            return res.status(200).json({ responseCode: 200, responseBody: {message : 'record updated Successfully'} });
          
          }
            
            
            );
        
        });
      }
  }  );

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
  companyToken,
  companyId,
  roleName
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
  this.companyId = companyId ; 
  this.roleName = roleName ; 
}



router.post("/invite", sf.authenticateToken,sf.authorizeRoles('CAN_GET_COMPANY'), async (sreq, res) => {
var req = sreq.body;

userRepository.fetchUserById(sreq.user.id , (fubir) =>{
  roleRepository.fetchRoleByRoleName(req.roleName, (frbrnr) =>{
    if (frbrnr != null){
    const token = jwt.sign({ roleName : frbrnr.name , companyToken : fubir.companyToken}, secretKey, {
    expiresIn: "24h", 
    });
    const notReq = {companyToken : token , emailAddress : req.email}; 
    mailingService.sendCreateMailNotification(notReq);
    return res.status(200).json({ responseCode: 200, responseBody: {message : 'sucess'} });
    } else return res.status(400).json({ responseCode: 200, responseBody: {message : 'failed'} });
    }
    );


});



});
    
    
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
