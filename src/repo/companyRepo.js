require("dotenv").config();
CompanyRepository = require("../model/company.js");

function createCompany(req) {
  try {
  return CompanyRepository.create(req).then((res) => {
    return res;
  });
} catch(error){
 console.log(error);
} 
}

function getCompanies() {
  CompanyRepository.findAll().then((companies) => {
    console.log(companies);
  });
}

async function fetchCompanyByToken(companyToken, callback) {
  try {
    const result = await CompanyRepository.findOne({ where: { companyToken: companyToken } });
    console.log("result ::"+result);
    callback(result);
  } catch (error) {
    console.error(error);
  } 
}





module.exports = {
    fetchCompanyByToken,
  createCompany,
};
