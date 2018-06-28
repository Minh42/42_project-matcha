let mysql = require('mysql');
let conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'my_db'
});
 
conn.connect();

module.exports = conn;
