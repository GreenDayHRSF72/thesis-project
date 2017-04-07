var mysql = require('mysql');
var config = require ('/config.js');

var connection = mysql.createConnection(mysqlConfig);

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
/*

// export functions below