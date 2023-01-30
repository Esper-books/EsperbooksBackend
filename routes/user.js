var express = require('express');
const { use } = require('.');
var router = express.Router();

const nodemailer = require('nodemailer');

var response = require('../config/util');
const configs = require('../config/config');

var bodyParser = require('body-parser')
var mysql = require('../model/mysql');

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

/*
    // Give SES the details and let it construct the message for you.
    client.sendEmail({
        to: 'devopsam@gmail.com'
    , from: 'sammiboyokpapi@gmail.com'
    , cc: 'devopsam@gmail.com'
    //, bcc: ['canAlsoBe@nArray.com', 'forrealz@.org']
    , subject: 'greetings'
    , message: 'your <b>message</b> goes here'
    , altText: 'plain text'
    }, function (err, data, res) {
    console.log(err)
    });
*/


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
        userParameter.status = 'inactive';
        userParameter.amount = '5000000';


        transporter.sendMail({
            from: 'devopsam@gmail.com',
            to: userParameter.username,
            subject: 'Pay Pay User account has successfully been created',
            text: userParameter.username + ': You have successfully created your Pay Pay Account.'
        });

    
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
    });




module.exports = router;
