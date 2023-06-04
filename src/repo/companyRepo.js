const sql = require("mssql");
require("dotenv").config();
var dbConnection = require("../config/dbConnection");
dbConnection.connect(dbConnection.config);
const CompanyRepository = require("../model/company.js");
companyRepoIns = new CompanyRepository();



function createCompany(req) {
  try {
  return companyRepoIns.companyRepository.create(req).then((res) => {
    return res;
  });
} catch(error){
 console.log(error);
} 
}

function getCompanies() {
    companyRepoIns.companyRepository.findAll().then((companies) => {
    console.log(companies);
  });
}

async function fetchCompanyByToken(companyToken, callback) {
  try {
    const result = await companyRepoIns.companyRepository.findOne({ where: { companyToken: companyToken } });
    console.log("result ::"+result);
    callback(result);
  } catch (error) {
    console.error(error);
  } 
}

// function findByToken (token){
//     try {
//       const company = await companyRepoIns.companyRepository.findOne({ where: { companyToken: token } });
//       console.log(user);
//     } catch (error) {
//       console.error(error);
//     }
// }

// Company.update(password, { where: username }).then(result => {
// console.log(result);
// });

// Company.destroy({ where: username }).then(result => {
// console.log(result);
// });

module.exports = {
    fetchCompanyByToken,
  createCompany,
};
