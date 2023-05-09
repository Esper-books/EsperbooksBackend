var Company = require('../model/models');
var mysql = require('mysql');
require('dotenv').config();

var con = mysql.createConnection({
  host:  process.env.configs_mysql_host,
  user: process.env.configs_mysql_user,
  password: process.env.configs_mysql_password,
  database: process.env.configs_mysql_database
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


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
    con.query('SELECT phoneNumber,emailAddress,name,state,companyAddress FROM companies where companyToken = ?', companyToken,function (err, result, fields) {
      if (err) throw err;
      callback(result[0]);
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


  
