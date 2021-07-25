const mysql = require("mysql2");
const mysqlHost = 'localhost';
const mysqlPort = '3306';
const mysqlUser = 'root';
const mysqlPass = '123';
const mysqlDb = 'beexCRMDb';

const connectionOptions = {
    host: mysqlHost,
    port: mysqlPort,
    user: mysqlUser,
    password: mysqlPass,
    database: mysqlDb
}

const connection = mysql.createConnection(connectionOptions);

module.exports = connection;