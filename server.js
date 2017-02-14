var express = require('express');
var app = express();
var port = 4000;

var path = require("path");
var hbs = require("express-handlebars");


var connection = require('./config/database.js');

connection.connect(function(err){
  if(err)
  {
    console.log(" no error  ++++++++++++++++");
  }
});

connection.end();

// view engine setup
app.engine('hbs',hbs({extname:'hbs', layoutsDir : __dirname + '/views/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//route our app
//var router = require('./app/routes');
//app.use('/', router);
//        or
require('./app/routes.js')(app);

app.listen(port,function () {
    console.log("Magic happens at port : 4000");
});
