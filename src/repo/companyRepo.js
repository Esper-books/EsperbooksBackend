var Company = require('../model/models');
const sql = require('mssql');
require('dotenv').config();


const config = {
  server:  process.env.DB_HOST,
  host:  process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false 
  }
};

sql.connect(config)
  .then(() => {
    console.log('connected!')
  })
  .catch((err) => {
    // Connection failed
    console.log('Error:', err);
  });

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


function fetchCompany1(companyToken,callback){
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


async function fetchCompany(companyToken,callback) {
  try {
    await sql.connect(config);
    const request = new sql.Request();
    request.input('param', sql.VarChar, companyToken);
    const query = 'SELECT phoneNumber,emailAddress,name,state,companyAddress FROM Companies where companyToken = @param';
    const result = await request.query(query);
    console.log(result);
    callback(result.recordset[0]);
  } catch (error) {
    console.error(error);
  } finally {
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
  
