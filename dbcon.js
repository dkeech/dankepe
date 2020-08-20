var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'dankeech.com',
  user            : 'dan',
  password        : 'helpersecretary',
  database        : 'dan'
});
module.exports.pool = pool;
