var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var http = require('http');


var indexRouter = require('./controller/index');
var userRouter = require('./controller/userController');
var companyRouter = require('./controller/companyController');
var loginRouter = require('./controller/loginController');


var jsonParser = bodyParser.json()
// parse application/json
app.use(bodyParser.json())
//app.use(bodyParser.json({ type: 'application/vnd.api+json' }))



app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/company', companyRouter);
app.use('/login', loginRouter);


app.listen(3000);