module.exports = function (app){

    var bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({ extended: true }));
    var sessions = require('express-session');
    app.use(sessions({ secret: 'secret', resave: false, saveUninitialized: true }));
    var session;
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
            res.render('upload.ejs');
            //res.send('your profile is here!! <a href="/logout"> LOGOUT </a>');
        } else {
            res.redirect('/login');
        }

    });
    app.get('/login', function (req, res) {
        if(req.session.uniqueId){
            res.redirect('/');
        }else{
            res.render('login.ejs');
        }
    });
  /*
    app.get('/redirects', function (req, res) {
        session = req.session;
        if(session.uniqueId){
            res.redirect('/upload');
        }else{
            res.write('Invalid email id or password <a href="/logout"> GO BACK </a>');
        }
    });
*/
    app.get('/signup', function (req, res) {
      if(req.session.uniqueId){
        res.redirect('/');
      }else{
        res.render('signup.ejs');
      }
    });


    app.get('/upload', function (req, res) {
        if(req.session.uniqueId){
            res.render('upload.ejs');
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

  //  app.get('/upload', common.imageForm);

//post request
    app.post('/signup', function (req, res) {
        console.log('req.body');
        console.log(req.body);
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

// Use the mv() method to place the file somewhere on your server
  sampleFile.mv('/home/ubuntu/Desktop/firstnodeapp-master/filename.jpg', function(err) {
    if (err) {
      res.status(500).send(err);
    }
    else {
      res.send('File uploaded!');
    }
  });
});
//    app.post('/upload', common.uploadImage);

    app.post('/login', function (req, res) {
        mysqlC.query('SELECT * from login where email = "'+req.body.email+'" ',
        function(err, rows, fields) {
            if (!err){
                console.log('The solution is: ', rows);
                if (req.body.password == rows[0].password){
                    req.session.uniqueId = req.body.email;
                    res.redirect('/');
                }
                else{
                  res.send('invalid passord');
                }
            }
            else{
                console.log('Error while performing Query.');
                res.send('some error occured');
              }
            });

    });
};
