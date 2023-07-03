var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var companyRepository = require("../repo/companyRepo");
var companyValidate = require("../validation/companyValidate");
var mailingService = require("../service/mailing_service");
const crypto = require("crypto");
var sf = require("../service/security");
var reqBody;
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
var userRepository = require("../repo/userRepo");
const jwt = require("jsonwebtoken");
const secretKey = "secret esperbook";

router.post("", (req, res) => {
  reqBody = req.body;
  reqBody.companyToken = generateUniqueToken();

  const token = jwt.sign({ roleName: 'Super Admin' , companyToken : reqBody.companyToken }, secretKey, {
    expiresIn: "8640h",
    });


  const { error } = companyValidate.companySchema.validate(reqBody);
  if (error) return res.status(400).json(error.details);
  companyRepository
    .createCompany(reqBody)
    .then((presp) => {
      presp.companyToken = token ; 
      mailingService.sendCreateMailNotification(presp);
      return res
        .status(200)
        .json({
          responseCode: 200,
          responseMessage: "Company Created Successfully!",
        });
    })
    .catch((error) => {
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

router.get("", sf.authenticateToken,sf.authorizeRoles('Admin Toolbox'), async (sreq, res) => {
  userRepository.fetchUserById(sreq.user.id, (fubir) =>{
      if (fubir !=null){
        companyRepository.fetchCompanyByToken(fubir.companyToken, (data) => {
          console.log(data);
          return res.status(200).json({ responseCode: 200, responseBody: data });
        });
      }
  }  );

});

function generateUniqueToken() {
  return crypto.randomBytes(60).toString("hex");
}

module.exports = router;
