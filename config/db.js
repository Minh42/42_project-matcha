let mysql = require('mysql');

let conn = mysql.createConnection({
 host     : '192.168.99.101',
 port     : '3306',
 user     : 'root',
 password : 'root',
 database : 'matcha'
});

conn.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "CREATE TABLE IF NOT EXISTS users(id_user int AUTO_INCREMENT NOT NULL PRIMARY KEY, username VARCHAR(30) NOT NULL, first_name VARCHAR(30) NOT NULL, last_name VARCHAR(30) NOT NULL, password VARCHAR(300) NOT NULL, email VARCHAR(50) NOT NULL)";
  conn.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});

module.exports = conn;
