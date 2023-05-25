var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var companyRepository = require('../repo/companyRepo');
var userValidate = require('../validation/userValidate');
const crypto = require('crypto');
var reqBody ;
router.use(bodyParser.json()); 
router.use(bodyParser.urlencoded({ extended: true }));
router.post('', (req, res) =>  {
reqBody = req.body ; 
reqBody.companyToken = generateUniqueToken(); 
const { error} = userValidate.userSchema.validate(reqBody);
if (error) return res.status(400).json(error.details);
companyRepository.createCompany(reqBody).then(presp => {
    mailingService.sendCreateMailNotification(presp);
    return res.status(200).json({"responseCode":200,"responseMessage":"Company Created Successfully!"});
}) .catch(error => {
    console.log(error);
    return res.status(500).json({"responseCode":500,"responseMessage":"Server Error"});
  });;
});
