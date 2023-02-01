var express = require('express');
const { use } = require('.');
var router = express.Router();

const nodemailer = require('nodemailer');

var response = require('../config/util');
const configs = require('../config/config');

var bodyParser = require('body-parser')
var mysql = require('../model/mysql');
var api = require('../model/api');

/* GET home page. */
var jsonParser = bodyParser.json()
var code = configs.code;


// var ses = require('node-ses')
 // , client = ses.createClient({key: 'dAKIAUKPRNEC7HU2HM5OM', secret: 'dFgHXTP5ZSxSwFqzQ2o0nWZkN8GVw5yUyu0QKjWBP'});


 const transporter = nodemailer.createTransport({
    host: 'email-smtp.us-east-1.amazonaws.com',
    port: 587,
    auth: {
        user: 'AKIAUKPRNEC7LSSEAEGU',
        pass: 'BB2J2HZBAhe56cXwmTiLNJxHvaQ21V8VAHwTPjnIV9vf'
    }
});


router.post('/authorize', jsonParser,function(req, res, next) {
//  res.status.('index', { title: 'Express' });
console.log(req.body)
    if(!req.body.username){
        var code = configs.code.invalid_username;
    return res.status(400).json(response.error_response(code.description,code.code))
    }

    if(!req.body.password){
        var code = configs.code.invalid_username;
    return res.status(400).json(response.error_response(code.description,code.code))
    }

    // fetch user from database 
    const username = req.body.username;
    const password = req.body.password;

    mysql.fetch_user(username,password,function(response_callback){
    console.log(response_callback);
        if(!response_callback){
            var code = configs.code.invalid_username;
            return res.status(400).json(response.error_response(code.description,code.code))
        }

// send email
 transporter.sendMail({
    from: 'devopsam@gmail.com',
    to: username,
    subject: 'Pay Pay User have successfully logged in',
    text: username + ': You have successfully logged in to your Pay Pay Account.'
});

        code = 200;
        return res.status(code).json(response.success_response("user details has successfully been fetched",response_callback))
    });
});



router.post('/fetch_user', jsonParser,function(req, res, next) {
    //  res.status.('index', { title: 'Express' });
    console.log(req.body)
        if(!req.body.username){
            var code = configs.code.invalid_username;
        return res.status(400).json(response.error_response(code.description,code.code))
        }

    
        // fetch user from database 
        const username = req.body.username;
    
        mysql.fetch_user_detail(username,function(response_callback){
        console.log(response_callback);
            if(!response_callback){
                var code = configs.code.invalid_username;
                return res.status(400).json(response.error_response(code.description,code.code))
            }
    
            code = 200;
            return res.status(code).json(response.success_response("user details has successfully been fetched",response_callback))
        });
    });



router.post('/create', jsonParser,function(req, res, next) {
    //  res.status.('index', { title: 'Express' });
    console.log(req.body)
        if(!req.body.username || !req.body.password || !req.body.fullname || !req.body.reference){
            var code = configs.code.incomplete_parameter;
        return res.status(400).json(response.error_response(code.description,code.code))
        }

        // fetch user from database 
        const userParameter = {};
        userParameter.username = req.body.username;
        userParameter.password = req.body.password;
        userParameter.fullname = req.body.fullname;
        userParameter.reference = req.body.reference;
        userParameter.phone = req.body.phone;
        userParameter.type = req.body.type;
        userParameter.status = 'inactive';
        userParameter.amount = '5000000';
        userParameter.accountNumber = '';


        transporter.sendMail({
            from: 'info@paypay.ng',
            to: userParameter.username,
            subject: 'Pay Pay User account has successfully been created',
            text: userParameter.username + ': You have successfully created your Pay Pay Account.'
        });

        api.create_wallet(userParameter.phone,userParameter.username, function(response_callback){ 

            if(!response_callback.accountNumber){
                   var code = configs.code.authentication_error;
                   return res.status(code.code).json(response.error_response(code.description,userParameter.username))
               }

            if(response_callback.accountNumber){
                userParameter.accountNumber = response_callback.accountNumber;
                userParameter.wallet =JSON.stringify(response_callback);
            mysql.insert_user(userParameter,function(response_callback){
                console.log(response_callback);
                    if(!response_callback){
                        var code = configs.code.invalid_username;
                        return res.status(code.code).json(response.error_response(code.description,code.code))
                    }
                    if(response_callback.code == "ER_DUP_ENTRY"){
                        var code = configs.code.duplicate_entry;
                        return res.status(code.code).json(response.error_response(code.description,userParameter.username))
                    }
                    code = 200;
                    userParameter.insertId = response_callback.insertId;
                    return res.status(code).json(response.success_response("user details has successfully been fetched",userParameter))
                }); 
            }           
        });


    

    });


    
router.post('/fetch_report', jsonParser,function(req, res, next) {
    //  res.status.('index', { title: 'Express' });
        if(!req.body.userid){
            var code = configs.code.invalid_username;
        return res.status(400).json(response.error_response(code.description,code.code))
        }
    
        // fetch user from database 
        const userid = req.body.userid;
    
        mysql.fetch_user_report(userid,function(response_callback){
        console.log(response_callback);
            if(!response_callback){
                var code = configs.code.invalid_username;
                return res.status(400).json(response.error_response(code.description,code.code))
            }
    
            code = 200;
            return res.status(code).json(response.success_response("user details has successfully been fetched",response_callback))
        });
    });
    




module.exports = router;
