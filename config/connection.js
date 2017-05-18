'use strict';

var mysql = require('mysql'),
  env = process.env.NODE_ENV || 'development',
  config = require('./config')[env];

var pool = mysql.createPool({
  connectionLimit: 10,
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.dbName
});

module.exports = pool;