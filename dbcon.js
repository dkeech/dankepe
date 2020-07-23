var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_bonnerke',
  password        : '9466',
  database        : 'cs340_bonnerke'
});

module.exports.pool = pool;
