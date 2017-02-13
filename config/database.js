var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'ubuntu',
  database : 'task'
});

module.exports = connection;

//  or
/*  var mysql = require('mysql');
// Initialize pool
var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : '127.0.0.1',
    user     : 'root',
    password : 'root',
    database : 'db_name',
    debug    :  false
});
module.exports = pool;
*/
