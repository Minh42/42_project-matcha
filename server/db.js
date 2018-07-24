// var mysql = require('mysql')
// var util = require('util')
// var pool = mysql.createPool({
//     connectionLimit: 10,
//     host     : '192.168.99.100',
//     port     : '3306',
//     user     : 'root',
//     password : 'root',
//     database : 'matcha'
// })

// pool.getConnection((err, connection) => {
//     if (err) {
//         if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//             console.error('Database connection was closed.')
//         }
//         if (err.code === 'ER_CON_COUNT_ERROR') {
//             console.error('Database has too many connections.')
//         }
//         if (err.code === 'ECONNREFUSED') {
//             console.error('Database connection was refused.')
//         }
//     }
//     else 
//       console.log('Connection established');
//     if (connection) connection.release()
//     return
// })

// pool.query = util.promisify(pool.query)

// module.exports = pool

var spawn = require("child_process").spawn;
var logFile;

var mysqlimport = spawn('/usr/local/bin/mysql', [
    '-u' + 'root',
    '-p' + 'root',
    '-h' + '192.168.99.100',
    '--default-character-set=utf8',
    '--comments'
]);

mysqlimport.stdin.write(__dirname + '/db.sql');
mysqlimport.stdin.end();
mysqlimport
        .stdout
        .pipe(logFile)
        .on('data', function(data) {
           console.log(data); 
        })
        .on('finish', function() {
            console.log('finished')
        })
        .on('error', function(err) {
            console.log(err)
        });