
// Create a connection pool to reuse connections
const pool = mysql.createPool({
    host: configs.mysql.host,
    user: configs.mysql.user,   
    password: configs.mysql.password,
    database: configs.mysql.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  
  module.exports = Company;
  
  
  
  
  
  function fetch_user_detail(username,callback){
    con.query('SELECT * FROM user where username = ?', [username],function (err, result, fields) {
      if (err) throw err;
      //console.log(result);
      callback(result[0]);
    });
  }
  
  
  function fetch_user(username,password,callback){
    con.query('SELECT * FROM user where username = ? and password = ?', [username,password],function (err, result, fields) {
      if (err) throw err;
      //console.log(result);
      callback(result[0]);
    });
  }
  
  
  
  function insert_user(userParameter,callback){
    con.query('INSERT INTO user (username, password, fullname,reference,status,amount,type,phone,account_number,wallet_details) VALUES (?,?,?,?,?,?,?,?,?,?)', [userParameter.username,userParameter.password,userParameter.fullname,userParameter.reference,userParameter.status,userParameter.amount,userParameter.type,userParameter.phone,userParameter.accountNumber,userParameter.wallet],function (err, result) {
      if (err) {
        callback(err)
        }else{
        //console.log(result);
        console.log("1 record inserted");
        callback(result);
      }
    });
  }
  
  function fetch_user_report(username,callback){
    con.query('SELECT * FROM transaction where userid = ? order by id desc limit 0, 10', [username],function (err, result, fields) {
      if (err) throw err;
      console.log("asdsa",result);
      callback(result);
    });
  }
  
  
  
  module.exports = {
    fetch_user : fetch_user,
    fetch_user_report,fetch_user_report,
    insert_user : insert_user,
    fetch_user_detail : fetch_user_detail
   }