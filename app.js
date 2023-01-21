var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var http = require('http');


var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
/*
app.get('/', function(req, res){
   res.send("Hello world!");
});
*/

var jsonParser = bodyParser.json()
// parse application/json
app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))



app.use('/', indexRouter);
app.use('/user', userRouter);

app.listen(3000);