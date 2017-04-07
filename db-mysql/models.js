var mysql = require('mysql');
var mysqlConfig = require ('./config.js');

var connection = mysql.createConnection(mysqlConfig);

// to run: mysql -u username -p database_name < file.sql

// Create functions that query the databases
/* exampele querry
var queryName = function(cb) {
  connection.query(query, function(err, results, fields) {
    if (err) {
      callback(err, null);
    } else {
      cb(null, results);
    }
	
	});
}
*/
var selectAllFromTest = (cb) => {
  connection.query('SELECT * FROM test', (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, results)
    }
  })
}

// export functions below

module.exports.selectAllFromTest = selectAllFromTest;