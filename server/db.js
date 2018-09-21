'use strict'

const mysql = require('mysql')
const util = require('util')
const importer = require('node-mysql-importer')

const pool = mysql.createPool({
    connectionLimit: 1000,
    host     : '192.168.99.100',
    port     : '3306',
    user     : 'root',
    password : 'root',
    database : 'matcha'
})

importer.config({
    'host': '192.168.99.100',
    'user': 'root',
    'password': 'root',
    'database': 'matcha'
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
    else {
        console.log('Connection established');
        importer.importSQL(__dirname + '/db.sql').then( () => {
            console.log('All statements have been executed')
        }).catch( err => {
            console.log(`error: ${err}`)
        })
    }
    if (connection) connection.release()
    return
})

pool.query = util.promisify(pool.query)

module.exports = pool
