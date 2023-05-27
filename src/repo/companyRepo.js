var Company = require('../model/company');
const sql = require('mssql');
require('dotenv').config();
var dbConnection = require('../config/dbConnection'); 
dbConnection.connect(dbConnection.config);
const request = new sql.Request();

function createCompany(req){
return Company.Company.create(req).then(res=> {
    return res; 
});
}
   
function getCompanies(){
Company.findAll().then(companies => {
console.log(companies);
});
}

async function fetchCompany(companyToken,callback) {
  try {
    request.input('param', sql.VarChar, companyToken);
    const query = process.env.QUERY_GET_COMPANY_DETAILS_BY_COMPANY_TOKEN;
    const result = await request.query(query);
    callback(result.recordset[0]);
  } catch (error) {
    console.error(error);
   } 
   finally {
     await sql.close();
   }
}



// Company.update(password, { where: username }).then(result => {
// console.log(result);
// });

// Company.destroy({ where: username }).then(result => {
// console.log(result);
// });



  

  module.exports = 
  {
    fetchCompany , createCompany
   }

333
  
