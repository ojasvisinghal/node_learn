module.exports = function (app){


    var jwt = require('jsonwebtoken');

    var bodyParser = require('body-parser');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));


    var sessions = require('express-session');
    app.use(sessions({ secret: 'secret', resave: false, saveUninitialized: true }));
    var session;

    var nodemailer = require('nodemailer');
    //file upload
    var fileupload = require('express-fileupload');
    app.use(fileupload());


    var mysql      = require('mysql');
    var mysqlC = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'ubuntu',
      database : 'app'
    });

    mysqlC.connect(
        function(err){
            if(!err) {
                console.log("Database is connected ... nn");

            } else {
                console.log("Error connecting database ... nn");
            }
        });

//get  requests

    app.get('/', function (req, res) {
        if (req.session.uniqueId) {
            res.render('upload');
            //res.send('your profile is here!! <a href="/logout"> LOGOUT </a>');
        } else {
            res.redirect('/login');
        }

    });
    app.get('/login', function (req, res) {
        if(req.session.uniqueId){
            res.redirect('/');
        }else{
            res.render('login');
        }
    });

    app.get('/signup', function (req, res) {
      if(req.session.uniqueId){
        res.redirect('/');
      }else{
        res.render('signup');
      }
    });


    app.get('/upload', function (req, res) {
        if(req.session.uniqueId){
            res.render('upload');
            //res.send('your profile is here!!!!!!!!!!!!  <a href="/logout"> LOGOUT </a>');
        }else{
          res.redirect('/login');
        }
    });

    app.get('/logout',function (req, res) {
        req.session.destroy(function(err){
          if(err){
            console.log(err);
          }
            res.redirect('/');
        });
    });


    app.get('/contact',function(req,res){
      res.render('contact');
    });

    app.post('/contact',function(req,res){
      //Setup Nodemailer transport, I chose gmail. Create an application-specific password to avoid problems.
      let smtpTrans = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: "ojasvisinghal41@gmail.com",  //insert comapny's mail
              pass: "ubuntu123"  //insert password here
          }
      });
      //Mail options
    let mailOpts = {
          from: req.body.name + ' &lt;' + req.body.email + '&gt;', //grab form data from the request body object
          to: 'osinghal00@gmail.com', //email where emails are handled
          subject: 'Website contact form',
          text: req.body.message
      };

    smtpTrans.sendMail(mailOpts, function (error, response) {
        //Email not sent
        if (error) {
            console.log('error');
              }
        //Yay!! Email sent
        else {
            console.log('succesfully sent');
              }
    });


    });

//post request
    app.post('/signup', function (req, res) {
        console.log('req.body');
        console.log(req.body);
        //checking whether id is unique or Not
        mysqlC.query('insert into login(email , password) values ("' + req.body.email + '", "' + req.body.password + '")');
        res.send('you have successfully registered!!! <a href="/">PLEASE LOGIN TO CONTINUE </a>');

    });

//fileupload
    app.post('/upload', function(req, res) {
        var sampleFile;
        if (!req.files) {
          res.send('No files were uploaded.');
          return;
        }
//Reterive the uploades files
        sampleFile = req.files.sampleFile;

// Use the mv() method to place the file somewhere on your server and the name of saved file is filename.jpg
        sampleFile.mv('/home/ubuntu/Desktop/node_learn/filename.jpg', function(err) {
          if (err) {
            res.status(500).send(err);
          }
          else {
            res.send('File uploaded!');
          }
        });
      });



    app.post('/login', function (req, res) {
        mysqlC.query('SELECT * from login where email = "'+req.body.email+'" ',
        function(err, rows, fields) {
            if (!err){
                console.log('The solution is: ', rows);
                if (req.body.password == rows[0].password){
                    req.session.uniqueId = req.body.email;
                    res.redirect('/upload');
                }
                else{
                      res.json({
                          success: false,
                          data: {
                              message: "Invalid password"
                          }
                      });
                  //res.send('invalid passord');
                }
            }
            else{
                console.log('Error while performing Query.');
                res.send('some error occured');
              }
            });

    });
};
