var mysql = require('mysql');

var con = mysql.createConnection({
  host: "54.158.121.204",
  user: "paypay",
  password: "password",
  database: "paypay"
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


function insert_user(userParameter,callback){
  con.query('INSERT INTO user (username, password, fullname,reference) VALUES (?,?,?,?)', [userParameter.username,userParameter.password,userParameter.fullname,userParameter.reference],function (err, result) {
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