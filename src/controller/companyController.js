var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var companyRepository = require('../repo/companyRepo');
var companyValidate = require('../validation/companyValidate');
var mailingService = require('../service/mailing_service');
const crypto = require('crypto');
var reqBody ;
router.use(bodyParser.json()); 
router.use(bodyParser.urlencoded({ extended: true }));
router.post('', (req, res) =>  {
reqBody = req.body ; 
reqBody.companyToken = generateUniqueToken(); 
const { error} = companyValidate.companySchema.validate(reqBody);
if (error) return res.status(400).json(error.details);
companyRepository.createCompany(reqBody).then(presp => {
    mailingService.sendCreateMailNotification(presp);
    return res.status(200).json({"responseCode":200,"responseMessage":"Company Created Successfully!"});
}) .catch(error => {
    console.log(error);
    return res.status(500).json({"responseCode":500,"responseMessage":"Server Error"});
  });;
});


router.get('', (req, res) =>  {
  const { companyToken } = req.query;
  companyRepository.fetchCompany(companyToken,data => {
    console.log(data);
    return res.status(200).json({"responseCode":200,"responseBody" : data});
  });
});


function generateUniqueToken() {
    return crypto.randomBytes(20).toString('hex');
  }

module.exports = router;