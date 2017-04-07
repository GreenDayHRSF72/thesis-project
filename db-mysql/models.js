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

// Test models 
var selectAllFromTest = (cb) => {
  connection.query('SELECT * FROM test', (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, results)
    }
  })
};

var insertValueIntoTest = (val, cb) => {
  connection.query('INSERT INTO test (value) VALUES \
    (\'' + val + '\');', 
    (err, results) => {
      if (err) {
        cb(err, null);
      } else {
        // do nothing since successful
      }
    });
};


// export functions below

module.exports.selectAllFromTest = selectAllFromTest;
module.exports.insertValueIntoTest = insertValueIntoTest;