var express = require('express');
var app = express();
var port = 4000;

var connection = require('./config/database.js');

connection.connect(function(err){
  if(err)
  {
    console.log("error  ++++++++++++++++");
  }
});



connection.end();


//route our app
//var router = require('./app/routes');
//app.use('/', router);
//        or
var fun = require('./app/routes.js');
fun(app);

app.listen(port,function () {
    console.log("Magic happens at port : 4000");
});
