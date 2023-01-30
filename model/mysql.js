var mysql = require('mysql');
const configs = require('../config/config');

var con = mysql.createConnection({
  host:  configs.mysql.host,
  user: configs.mysql.user,
  password: configs.mysql.password,
  database: configs.mysql.database
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

function fetch_user(username,password,callback){
  con.query('SELECT * FROM user where username = ? and password = ?', [username,password],function (err, result, fields) {
    if (err) throw err;
    //console.log(result);
    callback(result[0]);
  });
}


function fetch_user_detail(username,password,callback){
  con.query('SELECT * FROM user where username = ?', [username],function (err, result, fields) {
    if (err) throw err;
    //console.log(result);
    callback(result[0]);
  });
}


function insert_user(userParameter,callback){
  con.query('INSERT INTO user (username, password, fullname,reference,status,amount) VALUES (?,?,?,?,?,?)', [userParameter.username,userParameter.password,userParameter.fullname,userParameter.reference,userParameter.status,userParameter.amount],function (err, result) {
    if (err) {
      callback(err)
      }else{
      //console.log(result);
      console.log("1 record inserted");
      callback(result);
    }
  });
}



module.exports = {
  fetch_user : fetch_user,
  insert_user : insert_user
 }