var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
	port: '3306',
	//socketPath: '/var/run/mysqld/mysqld.sock',
    user: 'capstone-cs467-2019',
    password: 'aGSmm28LoYul3ihF',
    database: 'capstone-cs467-2019',
    dateStrings: true
});

module.exports.pool = pool;


