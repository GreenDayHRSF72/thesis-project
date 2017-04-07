var express = require('express');
var bodyParser = require('body-parser');
var db = require('../db-mysql/models.js');

var app = express();
var PORT = process.env.PORT || 5000;

// app.user(express.static('../index.ios.js'));
// TODO setup an html doc to store web version?
// deploy separate server for mobile
app.use(bodyParser.json());

app.get('/', (req, res) => {
  db.selectAllFromTest(function(err, results){
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send(results);
    }
  });
});

// for testing out our database 
app.get('/test', (req, res) => {

});


app.listen(PORT, () => {
	console.log(`Listening to web server on port ${PORT}`);
});