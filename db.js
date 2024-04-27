const mysql = require('mysql');

// Create connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'Tess',
    password: '123456',
    database: 'learning_management'
});

module.exports = pool;
