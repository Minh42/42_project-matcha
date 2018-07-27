var mysql = require('mysql')
var util = require('util')
var pool = mysql.createPool({
    connectionLimit: 10,
    host     : '192.168.99.102',
    port     : '3306',
    user     : 'root',
    password : 'root',
    database : 'matcha'
})

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    else 
      console.log('Connection established');
    if (connection) connection.release()
    return
})

pool.query = util.promisify(pool.query)

module.exports = pool

