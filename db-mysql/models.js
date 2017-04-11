var mysql = require('mysql');
var mysqlConfig = require ('./config.js');

var connection = mysql.createConnection(mysqlConfig);

if (process.env.NODE_ENV === 'production') {
  connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);
}


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

// Queries related to getting user data for suggestion algorithm

var getUserInterests = (username, cb) => {
  connection.query(`SELECT name FROM interests INNER JOIN  users WHERE users.username = ${username};`, () => {

  });
} 

var getUserActivities = (username, cb) => {
  connection.query(`SELECT name, category FROM activities INNER JOIN ___ INNER JOIN ___ WHERE users.username = ${username} \
    asdfasdfasdf`)

} 


// make join table  for interests/users and predefine choices for interests?

// Add a user to the database
var addUserToDatabase = (user) => {
  
}

// Test models
var selectAllFromTest = (cb) => {
  connection.query('SELECT * FROM test', (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, results);
    }
  });
};

var insertValueIntoTest = (val, cb) => {
  connection.query(`INSERT INTO test (value) VALUES ${val};`, (err, results) => {
      if (err) {
        cb(err, null);
      } else {
        cb();
      }
    });
};


// export functions below

module.exports.selectAllFromTest = selectAllFromTest;
module.exports.insertValueIntoTest = insertValueIntoTest;