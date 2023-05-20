var Company = require('../model/models');
//const sql = require('mssql');
require('dotenv').config();

// const config = {
//   server:  process.env.configs_mssql_host,
//   host:  process.env.configs_mssql_host,
//   user: process.env.configs_mssql_user,
//   password: process.env.configs_mssql_password,
//   database: process.env.configs_mssql_database,
//   options: {
//     encrypt: true 
//   }
// };

// sql.connect(config)
//   .then(() => {
//     console.log('connected!')
//   })
//   .catch((err) => {
//     // Connection failed
//     console.log('Error:', err);
//   });

//  const request = new sql.Request();


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


function fetchCompany(companyToken,callback){
  const query = 'SELECT phoneNumber,emailAddress,name,state,companyAddress FROM companies where companyToken = ?'
  request.query(query, companyToken , (err, result) => {
    if (err) {
      console.log('Error:', err);
    } else {
      console.log('Result:', result.recordset);
      callback(result.recordset[0]);
    }
  });

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
  
