const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',  // Database host
    user: 'leandrogrc',       // Your MariaDB username
    password: '531642', // Your MariaDB password
    database: 'wpp_links', // The database you want to use
    connectionLimit: 5 // Maximum number of connections
});


module.exports = {pool};