
var mysql = require('mysql');
var mysqlConfig = require('./config.js');
var connection = mysql.createConnection(mysqlConfig);
var Bluebird = require('bluebird');
const db = Bluebird.promisifyAll(connection);

if (process.env.NODE_ENV === 'production') {
  connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);
}


// to run: mysql -u userName -p database_name < file.sql

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

var getUserInterests = (userName, cb) => {
  connection.query(`SELECT name FROM interests INNER JOIN  users WHERE \ 
    users.userName = ${userName};`, (err, results) => {
      if (err) {
        cb(err, null);
      } else {
        cb(null, results);
      }
  });
} 

var getUserActivities = (userName, cb) => {
  connection.query(`SELECT name, category FROM activities INNER JOIN ___ INNER JOIN ___ \ 
    WHERE users.userName = ${userName} \ && `)

} 

var getAllUserVotes = (userName, cb) => {
  connection.query(`SELECT  name, category FROM activites`)
}

var getAllEventComments = (eventName, cb) => {
  connection.query(`SELECT * FROM comments __ JOIN WHERE event.name =\"${eventName}\" && \
    event.id = comment.event_id`, (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, err);
    }
  });
}

// make join table  for interests/users and predefine choices for interests?

// Add a user to the database
const addUserToDatabase = (user) => {
  const queryStr = 'INSERT INTO users SET ?';
  return db.queryAsync(queryStr, user);
};

var addUserToDatabaseFromLogin = (user) => {
  var name = user.name;
  var pic = user.pic;
  var email = user. email;

  connection.query('')
}

var getPublicEvents = (cb) => {
  connection.query('SELECT * FROM events WHERE private = 0;', (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, results);
    }
  });
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
        cb(null, results);
      }
    });
};


module.exports = {
  selectAllFromTest,
  insertValueIntoTest,
  addUserToDatabase,
};
