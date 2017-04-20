
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
// FIGURE THIS OUT BY EOD
const getUserInterests = (email) => {
  const qs = 'SELECT * FROM interests;';
  const queryStr = `SELECT name FROM interests INNER JOIN users WHERE users.email = "${email}" && users.id = interest.user_id;`;
  return db.queryAsync(qs, email);
};

const getActivitiesByEmail = (email) => {
  const queryStr = 'SELECT * FROM users WHERE email = ? LIMIT 1';
  return db.queryAsync(queryStr, [email]);
};

var getAllUserActivities = (email, cb) => {
  db.queryAsync(`SELECT  name, category FROM activites`)
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

const getUserByEmail = (email) => {
  const queryStr = 'SELECT * FROM users WHERE email = ? LIMIT 1';
  return db.queryAsync(queryStr, [email]);
};

const addEvent = (event) => {
  const queryStr = 'INSERT INTO events SET ?';
  return db.queryAsync(queryStr, event);
};

// select distinct events.name  from events inner join users on (events.creator_id = users.id) where users.email = ?;
const getEventByCreatorEmail = (email) => {
  const queryStr = 'SELECT events.id, events.*, users.username, users.photourl FROM events INNER JOIN users ON (events.creator_id = users.id) WHERE users.email = ?';
  return db.queryAsync(queryStr, email);
};

const getEventByParticipantId = (id) => {
  const queryStr = 'SELECT events.id, events.*, users.username, users.photourl FROM events INNER JOIN participants ON (events.id = participants.event_id) INNER JOIN users ON (users.id = events.creator_id) WHERE participants.user_id = ?';
  return db.queryAsync(queryStr, id);
};

const addParticipants = (eventId, email) => {
  const queryStr = 'INSERT INTO participants(user_id, event_id) SELECT id, ? FROM users WHERE email = ?';
  return db.queryAsync(queryStr, [eventId, email]);
};

const addUserToDatabase = (user) => {
  const queryStr = 'INSERT IGNORE INTO users SET ?';
  return db.queryAsync(queryStr, user);
};

var getPublicEvents = (cb) => {
  connection.query('SELECT events.*, users.username, users.photourl FROM events INNER JOIN users ON events.creator_id = users.id;', (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      let counter = 1;
      results.forEach((event) => {
        event.id = counter;
        counter += 1;
      });
      console.log('getPublicEvents query ----->', results);
      cb(null, results);
    }
  });
};

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

const updateParticipantResponse = (data, cb) => {
  connection.query(`UPDATE participants SET status='${data.participantStatus}' WHERE id=${data.participantId}`, (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, results);
    }
  });
};

const getEventParticipants = (eventId, cb) => {
  connection.query(`SELECT users.username, participants.id, participants.status, participants.user_id FROM participants INNER JOIN events ON participants.event_id = events.id INNER JOIN users ON participants.user_id = users.id WHERE events.id = ${eventId}`, (err, results) => {
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
  getUserByEmail,
  addEvent,
  getPublicEvents,
  addParticipants,
  getEventParticipants,
  updateParticipantResponse,
  getEventByCreatorEmail,
  getEventByParticipantId,
};
