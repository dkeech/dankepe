var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_keechd',
  password        : ''
  database        : 'cs340_keechd'
});
module.exports.pool = pool;
